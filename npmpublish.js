const process = require("child_process");

// 执行 npm run build 命令
(function() {
  process.exec('npm run build', (error, stdout, stderr) => {
    if (!error) {
      // 成功
    } else {
      // 失败
    }
  });
})();
