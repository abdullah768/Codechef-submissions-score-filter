// ==UserScript==
// @name         CodeChef submissions score filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A script that allows filtering the details of submissions based on the score of the submission
// @author       Abdullah Aslam
// @match        https://www.codechef.com/*status/*
// @license MIT
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    var cururl=$(location).attr("href");
    var ct;
    var numpages=3;

    $(document).ready(function() {

        $('.topbox-inner td:last').before("<td style='border-bottom:0px;' class='l-float'> <div class='l-float'> <input type='number' max='100' id='scorefilter' name='scorefilter' placeholder='Score' class='field-style-text'/> </div> </td>");
        $('#scorefilter').css("width","50px");
        var i=0;

        var ind=cururl.indexOf("scorefilter=");
        var score;
        if(ind!=-1)
        {
            ind+=12;
            score=cururl.substr(ind,3);
            if(score[0]=='&')
                ind=-1;
            else
            {
                if(score[2]=='&')
                    score=score.substr(0,2);
                else
                    score=score.substr(1,2);
            }
        }
        if(ind!=-1)
        {
            score+="pts]";
            ct=0;
            $('#primary-content .dataTable tbody>tr').each(function () {
                var ro=$(this).find('td span').text();
                var ln=ro.length;
                if(ro.slice(ln-6)!=score)
                    $(this).remove();
                else
                    ct++;
            });
            ind=cururl.indexOf("page=");
            var pg;
            if(ind!=-1)
            {
                ind+=5;
                pg=cururl.substr(ind,2);
                if(pg[1]=='&')
                    pg=pg.substr(0,1);
            }
            else
                pg="0";
            //console.log(pg);
            var newurl;
            for(i=1;i<=numpages;i++)
            {
                pg=parseInt(pg)+1;
                //console.log(pg);
                if(ind==-1)
                {
                    var nind=cururl.indexOf('?');
                    newurl=cururl.substr(0,nind+1)+"page="+pg+"&"+cururl.substr(nind+1);
                }
                else
                {
                    var noind=ind+1;
                    if(cururl[noind]!='&')
                        noind++;
                    newurl=cururl.substr(0,ind)+pg+cururl.substr(noind);
                }
                //console.log(ct);
                if(ct>=25)
                    break;
                $.ajax({
                    url:newurl,
                    type:'GET',
                    //async: false,
                    success: function(data) {
                        var lct=0;
                        $(data).find('#primary-content .dataTable tbody>tr').each(function () {

                            var ro=$(this).find('td span').text();
                            var ln=ro.length;
                            if(ro.slice(ln-6)==score)
                            {
                                $('#primary-content .dataTable tbody>tr:last').after(this);
                                //console.log(ct);
                                ct++;
                            }
                        });
                    }
                });
            }
            $('.pageinfo').parent().next().find('a').attr('href',newurl);
        }

});
})();
