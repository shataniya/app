/* 
* @param istoggle
* @discription 外网访问的开关
* - 值为true，就是允许外网访问
* - 值为false，就是不允许外网访问
*/
// 默认不会开启ip外网
const iptoggle = false
/* 
* @隧道id 以及其映射的本地地址
* - 114831240784 --> 192.168.0.104:3000 --> http://sha.viphk.ngrok.org // 这个是项目运行的网址，也就是外网访问的地址
* - 105154240784 --> 127.0.0.1:4000	--> http://satan.viphk.ngrok.org // 这个是代理服务器的地址
* @开启外网的步骤
* - 1.打开终端，输入 cd /Users/sataniya/Downloads/darwin_amd64
* - 2.输入 ./sunny clientid 114831240784
* - 3.新建另一个终端，输入 cd /Users/sataniya/Downloads/darwin_amd64
* - 4.输入 ./sunny clientid 105154240784
* - 5.浏览器访问 http://sha.viphk.ngrok.org
*/
/* 
* @运行项目的步骤
* - 1.打开终端 输入 source ~/zshrc
* - 2.输入 mongod --dbpath /Users/sataniya/Desktop/db
* - 3.新建另一个终端，输入 source ~/zshrc
* - 4.输入 mongo
* - 5.打开浏览器，输入 http://localhost:27017
* 一旦出现 It looks like you are trying to access MongoDB over HTTP on the native driver 说明数据库已经打开
* - 6.打开vscode的终端，输入 nodemon server 或者 node server
* - 7.新建vscode的另一个终端，输入 npm run start // 启动项目
* - 8.打开浏览器，输入 http://localhost:3000 （如果项目自动开启浏览器的画，这一步可以省略）
*/
// 在这里存储自己的会员sessdata
const sessdata = 'd8b8d32e%2C1583203485%2C1aac7c21'
module.exports = {
    iptoggle,
    sessdata
}