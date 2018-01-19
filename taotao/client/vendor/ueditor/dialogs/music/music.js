function Music() {
    this.init();
}
/*
function getSearchResult( obj ){
    var doc = document.head || document.getElementsByTagName("head")[0] || document.documentElement, 
        script = document.createElement("script"), 
        url = ["https://auth-external.music.qq.com/open/fcgi-bin/fcg_weixin_music_search.fcg?remoteplace=txt.weixin.officialaccount&w=", obj.keyword, "&platform=weixin&jsonCallback=MusicJsonCallback&perpage=", obj.perpage, "&curpage=", obj.currentpage].join("");
        script.type = "text/javascript", 
        script.src = url, doc.appendChild(script);
}
function MusicJsonCallback( result ){
    $G( 'J_resultBar' ).innerHTML = "哈哈";

    formatCallbackData( result );

    $G( 'J_resultBar' ).innerHTML = getMusicListHtml( result.list );
}
function getMusicListHtml( list ){
    var resultStr = "";
    if( list.length === 0 ){
        resultStr = '<div class="media_list_tips_wrp tips_global"><span class="tips">暂无素材</span><span class="vm_box"></span></div>';
    }else{
        resultStr += '<div class="media_list_tips_wrp" style="display:none;"><i class="icon_loading_small white">loading...</i><span class="vm_box"></span></div><div class="qqmusic_list" id="js_audiomsg_list">';
        for( var i = 0; i < list.length; i++ ){
            resultStr += '<label class="frm_radio_label qqmusic_item"><i class="icon_radio"></i><span class="lbl_content"><span class="qqmusic_meta qqmusic_thumb_info"><span class="songname" id="songname_' + list[i].songid + '">' + list[i].songname + '</span><span class="singername" id="singername_' + list[i].songid + '">' + list[i].singername + '</span></span><span class="qqmusic_meta qqmusic_songsize">' + list[i].songsize + '</span><span class="qqmusic_meta qqmusic_songtime">' + list[i].songtime + '</span><span class="qqmusic_meta qqmusic_audioplay"  play_length=' + list[i].play_length + ' id="url_' + list[i].songid + '" audioid="' + list[i].songid + '" audiourl="' + list[i].m4a + '" mid="' + list[i].mid + '" songid="' + list[i].songid + '" albumurl="' + list[i].albumurl + '"></span></span><input type="radio" class="frm_radio" value="' + list[i].songid + '"></label>';
        }
        resultStr += '</div><div class="js_pagebar pagination_wrp" id="js_pagebar"></div>';
    }
    return resultStr;
}
function getMusicSize( size ) {
    var resultSize = "";
    return resultSize = size > 1048576 ? parseInt(size / 1048576) + "M" : "1M";
}
function getMusicTime( time ) {
    var resultTime = "";
    if (60 > time )
        resultTime = "00:" + (10 > time ? "0" : "") + time;
    else {
        var minute = Math.floor(time / 60), 
            seconds = time - 60 * minute;
        resultTime = (10 > minute ? "0" : "") + minute + ":" + (10 > seconds ? "0" : "") + seconds;
    }
    return resultTime;
}
*/

(function () {
    var pages = [],
        panels = [],
        selectedItem = null;

        window.MusicJsonCallback = function( result ){
            formatCallbackData( result );

            $G( 'J_resultBar' ).innerHTML = getMusicListHtml( result.list );
        };
        function getSearchResult( obj ){
            var doc = document.head || document.getElementsByTagName("head")[0] || document.documentElement, 
                script = document.createElement("script"), 
                url = ["https://auth-external.music.qq.com/open/fcgi-bin/fcg_weixin_music_search.fcg?remoteplace=txt.weixin.officialaccount&w=", obj.keyword, "&platform=weixin&jsonCallback=MusicJsonCallback&perpage=", obj.perpage, "&curpage=", obj.currentpage].join("");
                script.type = "text/javascript", 
                script.src = url, doc.appendChild(script);
        };
    
        function getMusicListHtml( list ){
            var resultStr = "";
            if( list.length === 0 ){
                resultStr = '<div class="media_list_tips_wrp tips_global"><span class="tips">暂无素材</span><span class="vm_box"></span></div>';
            }else{
                resultStr += '<div class="media_list_tips_wrp" style="display:none;"><i class="icon_loading_small white">loading...</i><span class="vm_box"></span></div><div class="qqmusic_list" id="js_audiomsg_list">';
                for( var i = 0; i < list.length; i++ ){
                    resultStr += '<label class="frm_radio_label qqmusic_item"><i class="icon_radio"></i><span class="lbl_content"><span class="qqmusic_meta qqmusic_thumb_info"><span class="songname" id="songname_' + list[i].songid + '">' + list[i].songname + '</span><span class="singername" id="singername_' + list[i].songid + '">' + list[i].singername + '</span></span><span class="qqmusic_meta qqmusic_songsize">' + list[i].songsize + '</span><span class="qqmusic_meta qqmusic_songtime">' + list[i].songtime + '</span><span class="qqmusic_meta qqmusic_audioplay"  play_length=' + list[i].play_length + ' id="url_' + list[i].songid + '" audioid="' + list[i].songid + '" audiourl="' + list[i].m4a + '" mid="' + list[i].mid + '" songid="' + list[i].songid + '" albumurl="' + list[i].albumurl + '"></span></span><input type="radio" class="frm_radio" value="' + list[i].songid + '" name="musicId" onclick="music.doselect()"></label>';
                }
                resultStr += '</div><div class="js_pagebar pagination_wrp" id="js_pagebar"></div>';
            }
            return resultStr;
        };
        function formatCallbackData( obj ){
            var resultObj = UE.utils.extend( {}, obj, false );
            return resultObj && resultObj.list && UE.utils.each( resultObj.list, function( val, i ){
                var tmpArr = val.f.split( "|" ),
                    time = tmpArr[7] || 0,
                    size = tmpArr[12] || 0,
                    songId = tmpArr[0],
                    c = tmpArr[tmpArr.length - 1],
                    d = tmpArr[tmpArr.length -3 ],
                    albumUrl = "/" + c.charAt( c.length - 2 ) + "/" + c.charAt( c.length - 1 ) + "/" + c + ".jpg";
                UE.utils.extend( val, {
                    songtime : getMusicTime( time ),
                    songsize : getMusicSize( size ),
                    songid : songId,
                    mid : d,
                    albumurl : albumUrl,
                    play_length : 1e3 * time
                }, false);
            })
        };
        function getMusicSize( size ) {
            var resultSize = "";
            return resultSize = size > 1048576 ? parseInt(size / 1048576) + "M" : "1M";
        }
        function getMusicTime( time ) {
            var resultTime = "";
            if (60 > time )
                resultTime = "00:" + (10 > time ? "0" : "") + time;
            else {
                var minute = Math.floor(time / 60), 
                    seconds = time - 60 * minute;
                resultTime = (10 > minute ? "0" : "") + minute + ":" + (10 > seconds ? "0" : "") + seconds;
            }
            return resultTime;
        };

        function insertQQMusic(e) {
            console.log( e );
            //window.insertMusic( getMusicIframe(e) );
            editor.execCommand( "inserthtml ", getMusicIframe( e ) );
        };
        function _makeMusicTmpl(e) {
            var t = "";
            return e && e.music_name && e.singer && (t += "<html>", t += "    <head>", t += "    <meta charset=UTF-8>", 
            t += "    <link rel=stylesheet href=/htmledition/style/widgets/pages/qqmusic.css?" + Math.random() + ">", 
            t += "    <title></title>", t += "    </head>", t += "    <body>", t += "    <div class=qqmusic_wrp>", 
            t += "    <i class=icon_qqmusic_switch></i>", t += "    <div class=qqmusic_content>", 
            t += "    <strong class=qqmusic_title>" + e.music_name + "</strong>", t += "    <p class=qqmusic_desc>" + e.singer + "</p>", 
            t += "    </div>", t += "    </div></body></html>"), t;
        };
        function getMusicIframe(e) {
            console.log( '----------------' );
            console.log( e );
            var t = e && e.musicid, i = e.mid, r = e && e.url, a = e && e.songname, o = e && e.albumurl, s = e && e.singername, n = e && e.play_length, c = e && e.commentid, d = "https://mp.weixin.qq.com" + "/cgi-bin/readtemplate?t=tmpl/qqmusic_tmpl&singer=" + encodeURIComponent(s) + "&music_name=" + encodeURIComponent(a);
            return ['<iframe class="res_iframe qqmusic_iframe js_editor_qqmusic" ', ' musicid="' + t + '"', ' mid="' + i + '"', ' albumurl="' + o + '"', ' audiourl="' + r + '"', ' music_name="' + a + '"', ' commentid="' + c + '"', ' singer="' + s + '" ', ' play_length="' + n + '" ', ' src="' + d, '"></iframe>'].join("");
        };

        Music.prototype = {
            total:70,
            pageSize:10,
            dataUrl:"http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.search.common",
            playerUrl:"http://box.baidu.com/widget/flash/bdspacesong.swf",

            init:function () {
                var me = this;
                domUtils.on($G("J_searchName"), "keyup", function (event) {
                    var e = window.event || event;
                    if (e.keyCode == 13) {
                        me.dosearch();
                    }
                });
                domUtils.on($G("J_searchBtn"), "click", function () {
                //    me.dosearch();
                    me.dosearch1();
                });
            },
            callback:function (data) {
                var me = this;
                me.data = data.song_list;
                setTimeout(function () {
                    $G('J_resultBar').innerHTML = me._renderTemplate(data.song_list);
                }, 300);
            },
            dosearch:function () {
                var me = this;
                selectedItem = null;
                var key = $G('J_searchName').value;
            if (utils.trim(key) == "")return false;
            key = encodeURIComponent(key);
            me._sent(key);
        },
        dosearch1 : function() {
            var me = this;
            selectedItem = null;
            var key = $G( 'J_searchName' ).value;
            if( utils.trim( key ) === "" ) return false;

            getSearchResult({
                keyword : encodeURIComponent( key ),
                perpage : 10,
                currentpage : 1
            });
        },
        doselect:function (i) {
            var me = this;
            if (typeof i == 'object') {
                selectedItem = i;
            } else if (typeof i == 'number') {
                selectedItem = me.data[i];
            }
        },
        onpageclick:function (id) {
            var me = this;
            for (var i = 0; i < pages.length; i++) {
                $G(pages[i]).className = 'pageoff';
                $G(panels[i]).className = 'paneloff';
            }
            $G('page' + id).className = 'pageon';
            $G('panel' + id).className = 'panelon';
        },
        listenTest:function (elem) {
            var me = this,
                view = $G('J_preview'),
                is_play_action = (elem.className == 'm-try'),
                old_trying = me._getTryingElem();

            if (old_trying) {
                old_trying.className = 'm-try';
                view.innerHTML = '';
            }
            if (is_play_action) {
                elem.className = 'm-trying';
                view.innerHTML = me._buildMusicHtml(me._getUrl(true));
            }
        },
        _sent:function (param) {
            var me = this;
            $G('J_resultBar').innerHTML = '<div class="loading"></div>';

            utils.loadFile(document, {
                src:me.dataUrl + '&query=' + param + '&page_size=' + me.total + '&callback=music.callback&.r=' + Math.random(),
                tag:"script",
                type:"text/javascript",
                defer:"defer"
            });
        },
        _removeHtml:function (str) {
            var reg = /<\s*\/?\s*[^>]*\s*>/gi;
            return str.replace(reg, "");
        },
        _getUrl:function (isTryListen) {
            var me = this;
            var param = 'from=tiebasongwidget&url=&name=' + encodeURIComponent(me._removeHtml(selectedItem.title)) + '&artist='
                + encodeURIComponent(me._removeHtml(selectedItem.author)) + '&extra='
                + encodeURIComponent(me._removeHtml(selectedItem.album_title))
                + '&autoPlay='+isTryListen+'' + '&loop=true';
            return  me.playerUrl + "?" + param;
        },
        _getTryingElem:function () {
            var s = $G('J_listPanel').getElementsByTagName('span');

            for (var i = 0; i < s.length; i++) {
                if (s[i].className == 'm-trying')
                    return s[i];
            }
            return null;
        },
        _buildMusicHtml:function (playerUrl) {
            var html = '<embed class="BDE_try_Music" allowfullscreen="false" pluginspage="http://www.macromedia.com/go/getflashplayer"';
            html += ' src="' + playerUrl + '"';
            html += ' width="1" height="1" style="position:absolute;left:-2000px;"';
            html += ' type="application/x-shockwave-flash" wmode="transparent" play="true" loop="false"';
            html += ' menu="false" allowscriptaccess="never" scale="noborder">';
            return html;
        },
        _byteLength:function (str) {
            return str.replace(/[^\u0000-\u007f]/g, "\u0061\u0061").length;
        },
        _getMaxText:function (s) {
            var me = this;
            s = me._removeHtml(s);
            if (me._byteLength(s) > 12)
                return s.substring(0, 5) + '...';
            if (!s) s = "&nbsp;";
            return s;
        },
        _rebuildData:function (data) {
            var me = this,
                newData = [],
                d = me.pageSize,
                itembox;
            for (var i = 0; i < data.length; i++) {
                if ((i + d) % d == 0) {
                    itembox = [];
                    newData.push(itembox)
                }
                itembox.push(data[i]);
            }
            return newData;
        },
        _renderTemplate:function (data) {
            var me = this;
            if (data.length == 0)return '<div class="empty">' + lang.emptyTxt + '</div>';
            data = me._rebuildData(data);
            var s = [], p = [], t = [];
            s.push('<div id="J_listPanel" class="listPanel">');
            p.push('<div class="page">');
            for (var i = 0, tmpList; tmpList = data[i++];) {
                panels.push('panel' + i);
                pages.push('page' + i);
                if (i == 1) {
                    s.push('<div id="panel' + i + '" class="panelon">');
                    if (data.length != 1) {
                        t.push('<div id="page' + i + '" onclick="music.onpageclick(' + i + ')" class="pageon">' + (i ) + '</div>');
                    }
                } else {
                    s.push('<div id="panel' + i + '" class="paneloff">');
                    t.push('<div id="page' + i + '" onclick="music.onpageclick(' + i + ')" class="pageoff">' + (i ) + '</div>');
                }
                s.push('<div class="m-box">');
                s.push('<div class="m-h"><span class="m-t">' + lang.chapter + '</span><span class="m-s">' + lang.singer
                    + '</span><span class="m-z">' + lang.special + '</span><span class="m-try-t">' + lang.listenTest + '</span></div>');
                for (var j = 0, tmpObj; tmpObj = tmpList[j++];) {
                    s.push('<label for="radio-' + i + '-' + j + '" class="m-m">');
                    s.push('<input type="radio" id="radio-' + i + '-' + j + '" name="musicId" class="m-l" onclick="music.doselect(' + (me.pageSize * (i-1) + (j-1)) + ')"/>');
                    s.push('<span class="m-t">' + me._getMaxText(tmpObj.title) + '</span>');
                    s.push('<span class="m-s">' + me._getMaxText(tmpObj.author) + '</span>');
                    s.push('<span class="m-z">' + me._getMaxText(tmpObj.album_title) + '</span>');
                    s.push('<span class="m-try" onclick="music.doselect(' + (me.pageSize * (i-1) + (j-1)) + ');music.listenTest(this)"></span>');
                    s.push('</label>');
                }
                s.push('</div>');
                s.push('</div>');
            }
            t.reverse();
            p.push(t.join(''));
            s.push('</div>');
            p.push('</div>');
            return s.join('') + p.join('');
        },
        exec:function () {
            var me = this;
            //if (selectedItem == null)   return;
            $G('J_preview').innerHTML = "";
            /*
            insertQQMusic( {
                albumurl: "/E/E/003Uhp200Yl5EE.jpg",
                mid: "00370e1w0ROVny",
                musicid: "151928",
                play_length: "193000",
                singername: "林海峰;农夫 - 三字头",
                songname: "嘻嘻哈哈",
                url: "http://ws.stream.qqmusic.qq.com/151928.m4a?fromtag=46"
            });
            */
            /*
            editor.execCommand('music', {
                url:me._getUrl(false),
                width:400,
                height:95
            });
            */
            editor.execCommand( 'music', getMusicIframe( {
                albumurl: "/E/E/003Uhp200Yl5EE.jpg",
                mid: "00370e1w0ROVny",
                musicid: "151928",
                play_length: "193000",
                commentid : "1211006749",
                singername: "林海峰;农夫 - 三字头",
                songname: "嘻嘻哈哈",
                url: "http://ws.stream.qqmusic.qq.com/151928.m4a?fromtag=46"
            } ));
        }
    };
})();



