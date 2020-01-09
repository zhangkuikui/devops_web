const apiUrl={
    login:"http://127.0.0.1:2020/login",
    getuser:"http://127.0.0.1:2020/getUser",
    logout:"http://127.0.0.1:2020/logout",
    host:{
        // 主机相关接口
        get_hostAll:"http://127.0.0.1:2020/host/hostList",
        post_hostAdd:"http://127.0.0.1:2020/host/hostAdd",
        hostdel:"http://127.0.0.1:2020/host/hostDel",
        hostedit:"http://127.0.0.1:2020/host/hostEdit",
    },
    site:{
      //站点设置菜单接口
      sitemenu_list:"http://127.0.0.1:2020/site/menuList",
      sitemenu_add:"http://127.0.0.1:2020/site/menuAdd",
      sitemenu_del:"http://127.0.0.1:2020/site/menuDel",
      sitemenu_current:"http://127.0.0.1:2020/site/menuCurrentList",

      //站点设置角色接口
      siterole_list:"http://127.0.0.1:2020/site/roleList",
      siterole_add:"http://127.0.0.1:2020/site/roleAdd",
      siterole_del:"http://127.0.0.1:2020/site/roleDel",

      //角色和菜单绑定
      siteRoleName_list:"http://127.0.0.1:2020/site/roleNameList",
      siteRoleMenu_list:"http://127.0.0.1:2020/site/roleMenuList",
      siteMenuName_list:"http://127.0.0.1:2020/site/MenuNameList",
      siteRoleMenuAdd:"http://127.0.0.1:2020/site/roleMenuAdd",
    }

};
export default apiUrl
