import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Variables globales pour les tests
declare global {
  var testSequelize: Sequelize;
  var testModels: any;
  var testJwtSecret: string;
}

beforeAll(async () => {
  // Configuration Sequelize avec SQLite en mémoire
  global.testSequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Désactiver les logs SQL pendant les tests
    define: {
      timestamps: true,
      underscored: false
    }
  });
  
  global.testJwtSecret = 'test-jwt-secret-key-for-mvp-testing';
  process.env.JWT_SECRET = global.testJwtSecret;
  
  // Définir les modèles de test
  await initTestModels();
  await global.testSequelize.sync({ force: true });
  
  // Insérer les données de base
  await seedTestData();
});

afterAll(async () => {
  if (global.testSequelize) {
    await global.testSequelize.close();
  }
});

beforeEach(async () => {
  // Nettoyer les tables avant chaque test (sauf les données de seed)
  await cleanTestData();
});

async function initTestModels() {
  // Modèle Role
  const Role = global.testSequelize.define('Role', {
    id_role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  // Modèle User
  const User = global.testSequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id_role'
      }
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  // Modèle Event
  const Event = global.testSequelize.define('Event', {
    id_event: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id_user'
      }
    }
  }, {
    tableName: 'events',
    timestamps: true
  });

  // Modèle EventParticipant
  const EventParticipant = global.testSequelize.define('EventParticipant', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id_event'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id_user'
      }
    }
  }, {
    tableName: 'event_participants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_id']
      }
    ]
  });

  // Modèle Program (pour les programmes d'exercices)
  const Program = global.testSequelize.define('Program', {
    id_program: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exercises: {
      type: DataTypes.TEXT, // JSON stocké comme texte
      allowNull: true
    },
    nutrition_suggestions: {
      type: DataTypes.TEXT, // JSON stocké comme texte
      allowNull: true
    }
  }, {
    tableName: 'programs',
    timestamps: true
  });

  // Associations
  User.belongsTo(Role, { foreignKey: 'id_role' });
  Event.belongsTo(User, { foreignKey: 'created_by' });
  EventParticipant.belongsTo(Event, { foreignKey: 'event_id' });
  EventParticipant.belongsTo(User, { foreignKey: 'user_id' });

  // Stocker les modèles globalement
  global.testModels = {
    Role,
    User,
    Event,
    EventParticipant,
    Program
  };
}

async function seedTestData() {
  // Créer les rôles de base
  await global.testModels.Role.create({
    libelle: 'user',
    is_default: true
  });
  
  await global.testModels.Role.create({
    libelle: 'admin_event',
    is_default: false
  });

  await global.testModels.Role.create({
    libelle: 'admin_app',
    is_default: false
  });

  // Créer quelques programmes de base
  await global.testModels.Program.create({
    name: 'Programme Débutant',
    description: 'Programme pour commencer en douceur',
    exercises: JSON.stringify([
      { name: 'Marche', duration: 30, intensity: 'faible' },
      { name: 'Étirements', duration: 15, intensity: 'faible' }
    ]),
    nutrition_suggestions: JSON.stringify([
      'Boire 1.5L d\'eau par jour',
      'Manger 5 fruits et légumes par jour'
    ])
  });
}

async function cleanTestData() {
  // Supprimer les données créées pendant les tests
  await global.testModels.EventParticipant.destroy({ truncate: true });
  await global.testModels.Event.destroy({ truncate: true });
  await global.testModels.User.destroy({ 
    where: {},
    truncate: true,
    restartIdentity: true
  });
}