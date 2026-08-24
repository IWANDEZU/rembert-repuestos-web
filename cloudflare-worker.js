import openNextWorker from "./.open-next/worker.js";

const worker = {
  fetch(request, env, ctx) {
    globalThis.__rembertDatabaseUrl = env.HYPERDRIVE?.connectionString || env.DATABASE_URL;
    return openNextWorker.fetch(request, env, ctx);
  },
};

export default worker;
