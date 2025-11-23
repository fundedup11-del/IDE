import { faker } from '@faker-js/faker';

export function generateProducts(count = 12, category = 'general') {
  const products = [] as Array<Record<string, any>>;

  for (let i = 0; i < count; i++) {
    const name = faker.commerce.productName();
    products.push({
      id: faker.string.uuid(),
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      category: category,
      price: Number(faker.commerce.price({ min: 5, max: 1999, dec: 0 })),
      description: faker.commerce.productDescription(),
      imageAlt: `${category} - ${name}`,
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: faker.number.int({ min: 0, max: 2000 }),
    });
  }

  return products;
}

export function generateUsers(count = 6) {
  const users = [] as Array<Record<string, any>>;
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: `https://i.pravatar.cc/150?u=${faker.string.numeric(6)}`,
      bio: faker.person.bio(),
    });
  }
  return users;
}

export function generateBlogPosts(count = 8) {
  const posts = [] as Array<Record<string, any>>;
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence();
    posts.push({
      id: faker.string.uuid(),
      title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      excerpt: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      date: faker.date.recent().toISOString(),
      readingTime: `${faker.number.int({ min: 3, max: 12 })} min read`,
    });
  }
  return posts;
}
