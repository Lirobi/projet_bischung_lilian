import { Sequelize, DataTypes, Model, Optional, ModelStatic } from "sequelize";

export const POLLUTION_TYPES = ["plastic", "chemical", "illegal-dump", "water", "air", "other"];

export interface PollutionAttributes {
  id: number;
  title: string;
  type: string;
  description: string;
  observedAt: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
}

export interface PollutionCreationAttributes
  extends Optional<PollutionAttributes, "id" | "photoUrl"> {}

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

export default function definePollutions(
  sequelize: Sequelize,
  _seq?: typeof Sequelize
): PollutionModel {
  const Pollutions = sequelize.define<PollutionInstance>(
    "pollution",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [3, 100] }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [POLLUTION_TYPES] }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { len: [10, 1000] }
      },
      observedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { isDate: true }
      },
      location: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { notEmpty: true }
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { min: -90, max: 90 }
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: { min: -180, max: 180 }
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isUrl: true }
      }
    },
    {
      tableName: "pollutions",
      freezeTableName: true,
      timestamps: false
    }
  );

  return Pollutions;
}
