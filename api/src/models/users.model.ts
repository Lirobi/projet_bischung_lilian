import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: number;
  login: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

export default function defineUsers(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): UserModel {
  const Users = sequelize.define<UserInstance>(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      login: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: { len: [3, 30], is: /^[A-Za-z0-9._-]+$/ }
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { len: [2, 50] }
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: { len: [2, 50] }
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      // Mot de passe haché (sel + hash scrypt), jamais renvoyé par l'API
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "users",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Users;
}
