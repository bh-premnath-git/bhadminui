module.exports = {
    apps: [
      {
        name: "next-app",
        script: "node",
        args: "server.js",
        cwd: "./",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };
  