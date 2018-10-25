/*
GreedyNav.js - https://github.com/lukejacksonn/GreedyNav
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Luke Jackson
*/
$(document).ready(function(){function e(){a=i.width()-n.width(),c=i.children().length,r=s[c-1],r>a?(i.children().last().prependTo(d),c-=1,e()):a>s[c]&&(d.children().first().appendTo(i),c+=1,e()),n.attr("count",o-c),c===o?n.addClass("hidden"):n.removeClass("hidden")}var n=$("nav.greedy-nav .greedy-nav__toggle"),i=$("nav.greedy-nav .visible-links"),d=$("nav.greedy-nav .hidden-links"),o=0,t=0,l=1e3,s=[];i.children().outerWidth(function(e,n){t+=n,o+=1,s.push(t)});var a,c,r,u;$(window).resize(function(){e()}),n.on("click",function(){d.toggleClass("hidden"),$(this).toggleClass("close"),clearTimeout(u)}),d.on("mouseleave",function(){u=setTimeout(function(){d.addClass("hidden"),n.toggleClass("close")},l)}).on("mouseenter",function(){clearTimeout(u)}),e()});