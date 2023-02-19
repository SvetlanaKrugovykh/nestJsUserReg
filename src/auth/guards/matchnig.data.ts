export const matching = [
  {
    serviceName: '/articles/create-article',
    roleName: 'admin',
    level: 15,
  },
  {
    serviceName: '/articles/get-article',
    roleName: 'user',
    level: 7,
  },
  {
    serviceName: '/articles/get-article',
    roleName: 'guest',
    level: 0,
  },
  {
    serviceName: '/subscriptions/subscription-create',
    roleName: 'user',
    level: 7,
  },
  {
    serviceName: '/subscriptions/subscription-cancel',
    roleName: 'admin',
    level: 15,
  },
];
