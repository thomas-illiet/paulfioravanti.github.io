var idx=lunr(function(){this.field("title"),this.field("excerpt"),this.field("categories"),this.field("tags"),this.ref("id"),this.pipeline.remove(lunr.trimmer);for(var e in store)this.add({title:store[e].title,excerpt:store[e].excerpt,categories:store[e].categories,tags:store[e].tags,id:e})});console.log(jQuery.type(idx)),$(document).ready(function(){$("input#search").on("keyup",function(){var e=$("#results"),t=$(this).val().toLowerCase(),i=idx.query(function(e){t.split(lunr.tokenizer.separator).forEach(function(i){e.term(i,{boost:100}),t.lastIndexOf(" ")!=t.length-1&&e.term(i,{usePipeline:!1,wildcard:lunr.Query.wildcard.TRAILING,boost:10}),""!=i&&e.term(i,{usePipeline:!1,editDistance:1,boost:1})})});e.empty(),e.prepend('<p class="results__found">'+i.length+" Result(s) found</p>");for(var r in i){var s=i[r].ref;if(store[s].teaser)var a='<div class="list__item"><article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork"><h2 class="archive__item-title" itemprop="headline"><a href="'+store[s].url+'" rel="permalink">'+store[s].title+'</a></h2><div class="archive__item-teaser"><img src="'+store[s].teaser+'" alt=""></div><p class="archive__item-excerpt" itemprop="description">'+store[s].excerpt.split(" ").splice(0,20).join(" ")+"...</p></article></div>";else var a='<div class="list__item"><article class="archive__item" itemscope itemtype="http://schema.org/CreativeWork"><h2 class="archive__item-title" itemprop="headline"><a href="'+store[s].url+'" rel="permalink">'+store[s].title+'</a></h2><p class="archive__item-excerpt" itemprop="description">'+store[s].excerpt.split(" ").splice(0,20).join(" ")+"...</p></article></div>";e.append(a)}})});