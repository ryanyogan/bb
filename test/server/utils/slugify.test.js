const generateSlug = require('../../../server/utils/slugify');

const MockUser = {
  slugs: ['ryan-yogan-jr', 'ryan-yogan-jr-1', 'ryan'],
  findOne({ slug }) {
    if (this.slugs.includes(slug)) {
      return Promise.resolve({ id: 'id' });
    }

    return Promise.resolve(null);
  },
};

describe('slufigy', () => {
  test('no duplication', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan Yogan');
    expect(slug).toBe('ryan-yogan');
  });

  test('one duplication', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan.');
    expect(slug).toBe('ryan-1');
  });

  test('multiplate duplications', async () => {
    expect.assertions(1);

    const slug = await generateSlug(MockUser, 'Ryan Yogan Jr.');
    expect(slug).toBe('ryan-yogan-jr-2');
  });
});
