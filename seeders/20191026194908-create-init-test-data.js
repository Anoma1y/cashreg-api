'use strict';
import DB from '../src/config/db';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.bulkInsert('users', [{
      login: 'admin',
      email: 'admin@example.com',
      password: '$2b$10$wsglrIQW7sFQJUNv14O5AudrqK7Q0vCf.JFbIW4gVtj4JJ92jO0he',
    }, {
      login: 'testuser',
      email: 'testuser@example.com',
      password: '$2b$10$wsglrIQW7sFQJUNv14O5AudrqK7Q0vCf.JFbIW4gVtj4JJ92jO0he',
    }], {
      returning: true
    });

    await Promise.all(users.map(async user => {
      await queryInterface.bulkInsert('profiles', [{
        user_id: user.id,
      }], {});

      await queryInterface.bulkInsert('settings', [{
        user_id: user.id,
      }], {});

      const workspace = await DB.Workspace.create({
        name: user.email,
        is_personal: true,
      }, { returning: true, });

      await queryInterface.bulkInsert('workspace_users', [{
        workspace_id: workspace.id,
        user_id: user.id,
        permissions: 0,
      }], {});
    }));

    await queryInterface.bulkInsert('currencies', [
      { id: 1, name: 'Российский рубль', charCode: 'RUR', numCode: '123', nominal: 1, value: 1, },
      { id: 2, name: 'Американский доллар', charCode: 'USD', numCode: '456', nominal: 1, value: 65.44, },
      { id: 3, name: 'Евро', charCode: 'EUR', numCode: '789', nominal: 1, value: 71.14, },
    ], {});

    await queryInterface.bulkInsert('workspaces', [{
      name: 'onixdev',
      is_personal: false,
    }], {});

    const workspaces = await DB.Workspace.findAll({
      json: true
    });

    for (const workspace of workspaces) {
      await queryInterface.bulkInsert('categories', [
        {
          workspace_id: workspace.id,
          name: 'Оплата налогов',
          type: 1,
        },
        {
          workspace_id: workspace.id,
          name: 'Оплата аренды',
          type: 1,
        },
        {
          workspace_id: workspace.id,
          name: 'Возврат долга',
          type: 2,
        }
      ], {});

      await queryInterface.bulkInsert('contragents', [
        {
          workspace_id: workspace.id,
          title: 'Аники',
          longTitle: 'ООО Гачисервис',
          active: true,
          payment_info: 'Карта 4544 4444 7787 9999',
          contrAgentInn: '454578787876',
          contrAgentKpp: '6768786786768744',
        },
        {
          workspace_id: workspace.id,
          title: 'Санёк',
          longTitle: 'ИП Свинцов Александр Романович',
          active: true,
          payment_info: 'Карта 3334 4444 4154 9999',
          contrAgentInn: '432222787876',
          contrAgentKpp: '6768786786768744',
        },
        {
          workspace_id: workspace.id,
          title: 'Летов',
          longTitle: 'ООО Моя Оборона',
          active: false,
          payment_info: 'Р/С 54578 78777 888877 Санкт-Петербург, улица Пушкина, дом Колотушкина 47',
          contrAgentInn: '54576787878',
          contrAgentKpp: '5555554545787787',
        },
      ], {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('settings', null, {});
    await queryInterface.bulkDelete('currencies', null, {});
    await queryInterface.bulkDelete('workspaces', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('contragents', null, {});
    await queryInterface.bulkDelete('workspace_users', null, {});
  }
};
