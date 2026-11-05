import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import db from "./models";
import initRoutes from "./routes";

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Authorization"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// health checks
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Pollution API." });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

db.sequelize
  .sync()
  .then(async () => {
    console.log("Synced db.");
    try {
      const count = await db.pollutions.count();
      if (count === 0) {
        await db.pollutions.bulkCreate([
          { title: "Bidons d'huile en bord de rivière", type: "chemical", description: "Une dizaine de bidons d'huile de vidange abandonnés au bord de l'Ill, certains percés.", observedAt: "2026-10-12", location: "Quai des Bateliers, Strasbourg", latitude: 48.5806, longitude: 7.7512 },
          { title: "Dépôt de gravats en forêt", type: "illegal-dump", description: "Tas de gravats, de plaques de plâtre et de pots de peinture déposés à l'entrée d'un chemin forestier.", observedAt: "2026-10-03", location: "Forêt de la Robertsau, Strasbourg", latitude: 48.6033, longitude: 7.7905 },
          { title: "Sacs plastiques dans le parc", type: "plastic", description: "Nombreux sacs et bouteilles en plastique autour de l'étang après un week-end ensoleillé.", observedAt: "2026-09-21", location: "Parc de l'Orangerie, Strasbourg", latitude: 48.5918, longitude: 7.7745 },
          { title: "Fumée noire près du port", type: "air", description: "Fumée noire et odeur de pneu brûlé pendant plus d'une heure en fin d'après-midi.", observedAt: "2026-10-08", location: "Port du Rhin, Strasbourg", latitude: 48.5722, longitude: 7.7898 },
          { title: "Mousse suspecte sur le canal", type: "water", description: "Mousse blanche épaisse à la surface du canal, sur une cinquantaine de mètres.", observedAt: "2026-09-30", location: "Canal du Rhône au Rhin, Illkirch-Graffenstaden", latitude: 48.5302, longitude: 7.7151 }
        ]);
        console.log("Jeu de données initial pour la table pollutions inséré avec succès.");
      }
    } catch (seedErr: unknown) {
      console.warn("Remarque : impossible d'insérer les données d'initialisation :", seedErr);
    }
  })
  .catch((err: Error) => {
    console.log("Failed to sync db: " + err.message);
  });


initRoutes(app);

// set port, listen on 0.0.0.0 for Render and container environments
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}.`);
});

export default app;
