// LiteLoader-AIDS automatic generated
/// <reference path="c:\vzbds2\LLSE-Aids/dts/helperlib/src/index.d.ts"/> 


var LandData =  data.parseJson(file.readFrom('./plugins/VZLand/data.json'))



mc.regPlayerCmd("reloadscore", "重設scoreboard", (pl, args)=>{
    mc.runcmd("scoreboard players set LCC LandCreateCount 0")
    mc.runcmd("scoreboard players set steps steps 0")
    mc.runcmd("scoreboard players set legLen legLen 0")
    mc.runcmd("scoreboard players set legStep legStep 1")
    mc.runcmd("scoreboard players set turns turns 0")
    mc.runcmd("scoreboard players set direction direction 0")
    mc.runcmd("scoreboard players set directionX directionX 64")
    mc.runcmd("scoreboard players set directionZ directionZ 0")
    mc.runcmd(`tag ${pl.realName} remove landed`)
})
// 創建領地
mc.regPlayerCmd("createland", "§e創建領地", (pl, args) => {
    var LandCreateCount = mc.getScoreObjective("LandCreateCount")
    LandCreateCount.addScore("LCC", 1)

    // 取得計分板物件
    var legLen = mc.getScoreObjective("legLen")
    var legStep = mc.getScoreObjective("legStep")
    var direction = mc.getScoreObjective("direction")
    var directionX = mc.getScoreObjective("directionX")
    var directionZ = mc.getScoreObjective("directionZ")
    var turns = mc.getScoreObjective("turns")

    // 玩家是否已經有家園
    if (!pl.hasTag("landed")) {

        // 當前方向
        let dir = direction.getScore("direction")

        // 移動一步
        if (dir == 0) {
            directionX.addScore("directionX", 128)
        } else if (dir == 1) {
            directionZ.addScore("directionZ", 128)
        } else if (dir == 2) {
            directionX.reduceScore("directionX", 128)
        } else if (dir == 3) {
            directionZ.reduceScore("directionZ", 128)
        }

        // 更新步數   一天要走10000步(沒
        legStep.addScore("legStep", 1)

        // 如果走滿邊長 就要轉向!
        if (legStep.getScore("legStep") >= legLen.getScore("legLen")) {
            legStep.setScore("legStep", 0)
            dir = (dir + 1) % 4
            direction.setScore("direction", dir)

            turns.addScore("turns", 1)
            if (turns.getScore("turns") >= 2) {
                turns.setScore("turns", 0)
                legLen.addScore("legLen", 1)
            }
        }

        let centerX =  directionX.getScore("directionX")
        let centerY = 256
        let centerZ =  directionZ.getScore("directionZ")

        mc.runcmd(`tp ${pl.realName} ${centerX} 257 ${centerZ}`)
        mc.runcmd(`gamemode spectator ${pl.realName}`)
        mc.runcmd(`structure load Land ${centerX +48-64} 216 ${centerZ -18}`)
        setTimeout(()=>{mc.runcmd(`gamemode adventure ${pl.realName}`)}, 2000)
        LandData[pl.xuid] = {
            x: centerX,
            y: centerY,
            z: centerZ
        };
        file.writeTo("plugins/VZLand/data.json", JSON.stringify(LandData, null, "\t"))


        pl.addTag("landed")
        pl.tell(` §f家園創建成功! 中心點 §6(${centerX}, ${centerY}, ${centerZ})§f`)

    } else {
        pl.tell(` §f您已經有§6家園§f了!`)
    }
})

// 你想想這是甚麼
mc.regPlayerCmd("home", "§e回到Land", (pl, args) => {
    if (pl.hasTag("landed")) {
        let LandData = JSON.parse(file.readFrom("plugins/VZLand/data.json"));
        let home = LandData[pl.xuid];

        if (home) {
            mc.runcmdEx(`tp ${pl.realName} ${home.x} ${home.y} ${home.z}`);
            pl.tell(" §f已將您傳送回家園!");
        } else {
            pl.tell(" §c找不到您的家園座標，請重新創建!");
        }
    } else {
        pl.tell(" §f您還沒有家園!")
    }
})
