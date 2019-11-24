'use strict';
import DB from '../src/config/db';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.bulkInsert('users', [{
      login: 'admin',
      email: 'admin@example.com',
      password: '$2b$10$wsglrIQW7sFQJUNv14O5AudrqK7Q0vCf.JFbIW4gVtj4JJ92jO0he',
      created_at: new Date(),
      updated_at: new Date(),
    }, {
      login: 'testuser',
      email: 'testuser@example.com',
      password: '$2b$10$wsglrIQW7sFQJUNv14O5AudrqK7Q0vCf.JFbIW4gVtj4JJ92jO0he',
      created_at: new Date(),
      updated_at: new Date(),
    }], {
      returning: true
    });

    const org_workspace = await DB.Workspace.create({
      name: 'onixdev',
      is_personal: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await Promise.all(users.map(async (user, idx) => {
      await queryInterface.bulkInsert('profiles', [{
        user_id: user.id,
        is_email_verified: idx === 0,
        is_blocked: false,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

      await queryInterface.bulkInsert('settings', [{
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

      const workspace = await DB.Workspace.create({
        name: user.email,
        is_personal: true,
        created_at: new Date(),
        updated_at: new Date(),
      }, { returning: true, });

      await queryInterface.bulkInsert('workspace_users', [{
        workspace_id: workspace.id,
        user_id: user.id,
        permissions: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

      await queryInterface.bulkInsert('workspace_users', [{
        workspace_id: org_workspace.id,
        user_id: user.id,
        permissions: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});
    }));

    await queryInterface.bulkInsert('currencies', [
      { id: 1, enabled: true, name: 'Российский рубль', charCode: 'RUR', numCode: '123', nominal: 1, value: 1, created_at: new Date(), updated_at: new Date() },
      { id: 2, enabled: true, name: 'Американский доллар', charCode: 'USD', numCode: '456', nominal: 1, value: 65.44, created_at: new Date(), updated_at: new Date() },
      { id: 3, enabled: true, name: 'Евро', charCode: 'EUR', numCode: '789', nominal: 1, value: 71.14, created_at: new Date(), updated_at: new Date() },
    ], {});
    //
    const workspaces = await DB.Workspace.findAll({
      json: true
    });

    for (const workspace of workspaces) {
      await queryInterface.bulkInsert('categories', [
        {
          workspace_id: workspace.id,
          name: 'Оплата налогов',
          type: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          workspace_id: workspace.id,
          name: 'Оплата аренды',
          type: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          workspace_id: workspace.id,
          name: 'Возврат долга',
          type: 2,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ], {});

      await queryInterface.bulkInsert('contragents', [
        {
          workspace_id: workspace.id,
          title: 'Аники',
          longTitle: 'ООО Гачисервис',
          active: true,
          payment_info: 'Карта 4544 4444 7787 9999',
          inn: '454578787876',
          kpp: '6768786786768744',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          workspace_id: workspace.id,
          title: 'Санёк',
          longTitle: 'ИП Свинцов Александр Романович',
          active: true,
          payment_info: 'Карта 3334 4444 4154 9999',
          inn: '432222787876',
          kpp: '6768786786768744',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          workspace_id: workspace.id,
          title: 'Летов',
          longTitle: 'ООО Моя Оборона',
          active: false,
          payment_info: 'Р/С 54578 78777 888877 Санкт-Петербург, улица Пушкина, дом Колотушкина 47',
          inn: '54576787878',
          kpp: '5555554545787787',
          created_at: new Date(),
          updated_at: new Date(),
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
