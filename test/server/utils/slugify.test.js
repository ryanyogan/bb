const generateSlug = require('../../../server/utils/slugify');

const MockUser = {
  slugs: ['ryan-a-yogan', 'ryan-a-yogan-1', 'ryan'],
  findOne({ slug }) {
    if (this.slugs.includes(slug)) {
      return Promise.resolve({ id: 'id' });
    }

    return Promise.resolve(null);
  },
};

describe('slugify', () => {
  test('no duplication', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan Yogan');
    expect(slug).toBe('ryan-yogan');
  });

  test('one duplication', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan');
    expect(slug).toBe('ryan-1');
  });

  test('multiple-duplications', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan A Yogan');
    expect(slug).toBe('ryan-a-yogan-2');
  });
});
