const fs = require('fs')
const path = require('path');
const asar = require('asar');
const JavaScriptObfuscator = require('javascript-obfuscator'); //使用javascript-obfuscator代码混淆
const asarmor = require('asarmor');

//获取指定文件夹下排除指定类型的文件
function getFiles(dirpath) {
    function getFiles_(dir, arr) {
        const stat = fs.statSync(dir);
        if (stat.isDirectory()) {
            const dirs = fs.readdirSync(dir);
            dirs.forEach(value => {
                let extname = path.extname(value);
                if (extname === '.js') getFiles_(path.join(dir, value), arr);
            })
        } else if (stat.isFile()) {
            //文件
            arr.push(dir);
        }
    };
    let arrs = [];
    getFiles_(dirpath, arrs);
    return arrs;
}

exports.default = async ({ appOutDir, packager }) => {
    try {
        const asarPath = path.join(packager.getResourcesDir(appOutDir), 'app.asar');
        let appPath = path.join(packager.getResourcesDir(appOutDir), 'app');
        if (fs.existsSync(asarPath)) {
            //如果存在asar压缩包
            asar.extractAll(asarPath, appPath);
        }
        //替换文件内容

        let fileArrs = getFiles(appPath + '/main', [".js"]);

        for (let i = 0; i < fileArrs.length; i++) {
            let con = fs.readFileSync(fileArrs[i], 'utf8');
            let obfuscationResult = JavaScriptObfuscator.obfuscate(con, {
                compact: true,
                debugProtection: true,
                disableConsoleOutput: true,
                numbersToExpressions: true,
                simplify: true,
                stringArrayShuffle: true,
                splitStrings: true,
                stringArrayThreshold: 1
            });
            fs.writeFileSync(fileArrs[i], obfuscationResult.getObfuscatedCode());
        }

        console.log('asar content replacement completed.');
        if (fs.existsSync(asarPath)) {
            fs.unlinkSync(asarPath);
            console.log('delete the original asar.');
        }
        await asar.createPackage(appPath, asarPath);
        fs.rmSync(appPath, { recursive: true, force: true })
        const archive = await asarmor.open(asarPath);
        archive.patch(); // apply default patches               
        archive.patch(asarmor.createBloatPatch(1314));
        console.log(`applying asarmor patches to ${asarPath}`);
        await archive.write(asarPath);
    } catch (err) {
        console.error(err);
    }
}