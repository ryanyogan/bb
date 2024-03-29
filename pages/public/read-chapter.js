/* eslint-disable react/no-danger */
import { Grid } from '@material-ui/core';
import Error from 'next/error';
import Head from 'next/head';
import { shape, string } from 'prop-types';
import React from 'react';
import { getChapterDetail } from '../../lib/api/public';
import withAuth from '../../lib/withAuth';

const styleGrid = {
  flexGrow: '1',
};

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: shape({
      _id: string.isRequired,
      htmlContent: string.isRequired,
    }),
  };

  static defaultProps = {
    chapter: null,
  };

  constructor(props) {
    super(props);

    const { chapter } = props;

    let htmlContent = '';
    if (chapter) {
      htmlContent = chapter.htmlContent;
    }

    this.state = {
      chapter,
      htmlContent,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { chapter } = nextProps;
    const {
      chapter: { _id },
    } = this.props;

    logger.info(chapter);

    if (chapter && chapter._id !== _id) {
      const { htmlContent } = chapter;
      this.setState({ chapter, htmlContent });
    }
  }

  static async getInitialProps({ req, query }) {
    const { bookSlug, chapterSlug } = query;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetail({ bookSlug, chapterSlug }, { headers });

    return { chapter };
  }

  renderMainContent() {
    const { chapter, htmlContent } = this.state;

    return (
      <div>
        <h3>
          Chapter:
          {chapter.title}
        </h3>

        <div className="main-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  }

  render() {
    const { chapter } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    const { book } = chapter;

    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>
            {chapter.title === 'Introduction'
              ? 'Introduction'
              : `Chapter ${chapter.order - 1}. ${chapter.title}`}
          </title>
          {chapter.seoDescription && <meta name="description" content={chapter.seoDescription} />}
        </Head>

        <Grid style={styleGrid} container direction="row" justify="space-around" align="flex-start">
          <Grid
            item
            sm={10}
            xs={12}
            style={{
              textAlign: 'left',
              paddingLeft: '25px',
            }}
          >
            <h2>
              Book:
              {book.name}
            </h2>

            {this.renderMainContent()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withAuth(ReadChapter, { loginRequired: false });
