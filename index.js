//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

var day = [[1729.126733983077, 1830.0848898395438, 1794.5883806080983, 1689.231927543719, 1882.3064842207746, 1919.1214583918259, 1690.1560783823124], [1850.236290993618, 1926.8354255987592, 1888.6169186358998, 1940.9305532666658, 1941.443191553255, 1835.7950378754422, 1706.4074284003143], [2068.983234285518, 2016.143788877326, 1858.0730677122422, 1949.182904716818, 1943.676719843508, 1912.753194620595, 1920.7341245214266], [2086.3660420129413, 2014.5340206077285, 1902.8614937428483, 2014.3491299370157, 2031.958096762855, 1938.239912337658, 1909.019511199093], [2230.6475021281585, 2142.0612967517304, 1975.7306815093425, 2125.66862474212, 2219.6820470077887, 2022.4128716456557, 1974.3127746131372], [2357.6423237301656, 2156.1400624243133, 1952.7709480884973, 2193.8104197250086, 2377.5988971707516, 2092.0383579832546, 2051.7787279235026], [2080.792872494843, 1782.957452777774, 1856.3221840103492, 2035.759967902965, 1952.7462165770237, 1792.453518689294, 1964.7428472840415], [2029.46999838469, 1866.8328538460923, 1955.3256706695154, 1973.4585996426013, 1875.2734145219792, 1766.3322316564634, 1885.1768035223186], [2002.3405757567743, 1988.5828995589463, 1793.9552137597266, 1788.6128754371352, 1907.1338331260395, 1894.4424790505773, 1875.3010078985803], [1220.2973103701836, 1179.8252493432688, 1160.0968031556483, 1236.71119869412, 1309.9538098087964, 1362.9946259880526, 1501.3373036958483], [1572.9943169056828, 1685.8967825587877, 1825.4326624371672, 1511.3018174837364, 1422.993199830925, 1459.6115389445729, 1411.032616268247], [1623.2373229070781, 1648.7113514728862, 1709.343882510775, 1689.5423058755882, 1737.8232095207745, 1681.0768753668685, 1693.898518136194], [1810.5738297324533, 1749.2599558561824, 1685.6059062529598, 1732.31595470499, 1784.3568776374402, 1669.1756251340953, 1661.876511393978], [1766.3749521368723, 1730.8117660852995, 1661.308380798318, 1758.235001932267, 1776.748431395656, 1661.718744431717, 1658.39973113116], [1605.8376880591995, 1566.0843737946875, 1489.7567137612775, 1622.5316992935789, 1670.24435191827, 1573.282390954155, 1537.7305798351067], [1587.174180954808, 1648.9949819535277, 1587.0686532699438, 1604.6324251372844, 1649.9795011168844, 1641.6723618336446, 1509.595377227608], [1416.8972295844378, 1488.2147296611336, 1505.335566239557, 1515.001640259431, 1531.7568014826008, 1515.5898048690515, 1477.228769671958], [1289.1671285955042, 1282.1591888904181, 1292.1696368546595, 1335.548012031517, 1317.6982719419814, 1326.2413086279228, 1346.5772345671796], [1655.02831839355, 1673.0269361663636, 1459.138974958543, 1471.8348717881145, 1479.5805683437582, 1421.1157944060542, 1436.7221265092126], [1701.6725507057333, 1736.4086490128802, 1600.984460789606, 1684.4269007521377, 1734.2709604754289, 1608.4775903062243, 1620.7636763514786], [1521.5381232654604, 1524.3716623484338, 1402.283030111867, 1449.6634610469932, 1529.485215451146, 1468.4984363583626, 1522.7090172345938], [1635.4165527556088, 1557.9936391303931, 1416.0511305327482, 1435.854275202912, 1483.357381101393, 1422.5360755262523, 1485.8243498780857], [1558.7881206883249, 1427.825002775529, 1357.5823310910741, 1349.944651753774, 1375.1486045828415, 1421.404503682364, 1487.0455808618358], [1689.0133795750376, 1517.7056986678062, 1304.092179794614, 1410.2130296357868, 1454.0782990144144, 1398.8029887291498, 1484.3613423535207], [1624.8504711601558, 1490.7051998166617, 1242.344075468393, 1402.6214777133528, 1507.1999088272964, 1340.9725374176442, 1423.272549498065], [1469.9087766132145, 1476.5769713636207, 1355.2795263726555, 1375.330108397253, 1413.930311466797, 1289.5035186690563, 1335.9508097504047], [1291.8934193585505, 1423.1412538213617, 1468.807684494928, 1416.8586371045385, 1396.9529100413383, 1349.042621159395, 1301.5953690864276], [1106.8513341681337, 1226.4626899307787, 1236.83138167966, 1175.1371076579571, 1220.5981908199417, 1296.62490862813, 1251.9888773823204], [1201.2778779827781, 1345.4409812116405, 1267.0932329975371, 1205.5466359019647, 1291.0987307019116, 1299.7184853138424, 1156.7729927535636], [1069.115974978923, 1128.3720656463333, 1158.2511147951423, 1207.4544648343676, 1278.5198922303848, 1297.0159863390268, 1192.0494369037797], [812.0173854896004, 866.644034738194, 827.1569409493479, 885.6282397972469, 949.5744131908338, 933.6383052053856, 964.3302021996433], [728.0478645747628, 785.4430918166904, 789.3134596380826, 830.5863649160444, 832.6500784580442, 797.2704001897644, 812.6787783041259], [631.1330004724934, 658.7256043073326, 676.3429002731141, 701.9389341421354, 715.5144061108601, 720.9355682780998, 737.2306503178077], [1097.2259916265593, 1141.2943065560805, 1136.776571019469, 1095.98379083579, 1061.5995643636275, 1051.3815612311514, 1026.6268583826268], [1294.6984675140363, 1147.417345419894, 1170.2665445975344, 1296.2956455057918, 1233.7872881504713, 1277.6468810567312, 1448.5618221335526], [1414.5920397695234, 1372.869711842248, 1280.2662914087764, 1267.7724968977766, 1302.692918649675, 1310.481817090859, 1404.834754038593], [1448.7824995367087, 1405.940237397378, 1386.8232498506602, 1425.5020292553158, 1423.6342028217482, 1384.8593858443069, 1435.5150907298016], [1476.1871124950671, 1377.064583094684, 1365.4115692753426, 1403.8150228910272, 1347.166688942004, 1382.513242903594, 1448.8694559780747], [1322.0058332073245, 1367.1725260191638, 1417.8178192220157, 1356.3702516845474, 1347.9708192959847, 1409.9382366049663, 1389.9673343477773], [1418.3386581752743, 1396.5388676765842, 1414.6205647905715, 1438.9684868058057, 1477.132849468236, 1408.665384691913, 1422.0294746389577], [1620.048418723958, 1576.187358410631, 1576.658045046456, 1549.1255661861446, 1520.5667514155518, 1534.4096837337506, 1564.3892479895487], [1749.2414099075468, 1870.1291464957567, 1753.3306581215143, 1672.9144098149295, 1771.1407119825872, 1775.400370190211, 1610.2604754283802], [1503.5921600746487, 1636.6863750123698, 1835.4223845433676, 1719.2911153275825, 1622.514376765188, 1658.2230739665797, 1644.5726203421848], [1400.9562476532706, 1487.10003323611, 1412.3571608875627, 1347.376252305245, 1484.958242472078, 1483.5775898375523, 1478.5999345737987], [1796.058798224081, 1771.777168427296, 1612.4028303914304, 1479.9409984155257, 1627.7482120296918, 1755.3247866778836, 1613.3478996346046], [1788.2327100351104, 1719.6772652340671, 1706.701095334885, 1691.994838452688, 1717.3672340889873, 1777.1273736629641, 1727.802935846738]];
var month = [];

for(let i=0;i<day.length;i++){
  for(let j=0;j<7;j++){
    day[i][j]=day[i][j]/100;
  }
}

var k=0;
for(let i=0;i<day.length;i++){
  for(let j=0;j<7;j++){
    month[k]=day[i][j];
  }
  k++;
}
// console.log(month);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://elcon:"+process.env.MONGO_PASSWORD+"@elcon.ulbh37o.mongodb.net/?retryWrites=true&w=majority");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  electricityId: Number,
  name: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/homeAfterLogin");
  } else {
    res.render("home");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/homeAfterLogin", (req, res) => {
  if (req.isAuthenticated()) {
    var user = req.user;
    User.findOne({ username: user.username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("homeAfterLogin", { User: foundUser, data: day});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/month", (req, res) => {
  if (req.isAuthenticated()) {
    var user = req.user;
    User.findOne({ username: user.username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("month", { User: foundUser, data: month.slice(1, 31)});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    var user = req.user;
    User.findOne({ username: user.username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          res.render("dashboard", { User: foundUser, data: day});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", (req, res) => {
  User.register(
    {
      username: req.body.username,
      name: req.body.name,
      electricityId: req.body.electricityId,
      active: false,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/dashboard");
        });
      }
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/homeAfterLogin",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running"));
