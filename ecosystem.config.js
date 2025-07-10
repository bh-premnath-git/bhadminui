module.exports = {
    apps: [
      {
        name: "next-app",
        script: "node_modules/next/dist/bin/next",
        args: "start -p 5001",
        cwd: "./",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  