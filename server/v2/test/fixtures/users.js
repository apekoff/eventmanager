module.exports = {
  register: {
    validAdminUser: {
      firstname: 'Mark',
      lastname: 'Ben',
      address: '9 Cole Road',
      state: 8,
      phonenumber: 12345678901,
      username: 'benmark',
      password: 'klsldskds',
      repassword: 'klsldskds',
      role: 1,
      email: 'benmark@yahoo.com',
    },
    validOrdinaryUser: {
      firstname: 'John',
      lastname: 'Doe',
      address: '9 Cole Road',
      state: 9,
      phonenumber: 12945678901,
      username: 'johndoe',
      password: 'klssdsfsds',
      repassword: 'klssdsfsds',
      role: 2,
      email: 'johndoe@yahoo.com',
    },
    invalidPasswordCombination: {
      firstname: 'Mark',
      lastname: 'Ben',
      address: '9 Cole Road',
      state: 8,
      phonenumber: 12345678901,
      username: 'benmark',
      password: 'klsldskds',
      repassword: 'klsldss',
      role: 2,
      email: 'benmark@yahoo.com',
    },
  },
  login: {
    WrongPassword: {
      username: 'benmark',
      password: 'klsdsdsfaafsfsssfldskds',
    },
    NOUsername: {
      username: null,
      password: 'klsldskds',
    },
    NOPassword: {
      username: 'benmark',
    },
    validAdminUser: {
      username: 'benmark',
      password: 'klsldskds',
    },
    validOrdinaryUser: {
      username: 'johndoe',
      password: 'klssdsfsds',
    },
  },
};