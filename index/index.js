
Index = function(){
    var idexp = /\#(\w*)$/i;
    var noiseexp = /.*#/i;
    var contentdefault = 'content';
    var hiddendefault = 'hidden';
    var promptdefault = 'prompt';

    var linkimg = function(owner, id, title, src){
        var a = document.createElement('a');
        a.href = '#' + id;
        var img = document.createElement('img');
        img.title = title;
        img.src = src;
        img.alt = title;
        a.appendChild(img)
        owner.appendChild(a);
    }

    return {
        load: function(prompt){
            var lis = document.getElementsByTagName("li");
            for (var i = 0, len = lis.length; i < len; i++){
                if (lis[i].className == (prompt || promptdefault)){
                    var span = document.createElement('span');
                    span.className = (prompt || promptdefault);
                    linkimg(span, lis[i].id, 'Video', 'img/watch.jpg');
                    linkimg(span, lis[i].id, 'Documentation', 'img/readmore.jpg');
                    linkimg(span, lis[i].id, 'Forum', 'img/feedback.jpg');
                    lis[i].appendChild(span);
                    console.info(lis[i]);
                }
            }
        },

        update: function(trigger, content, hidden){
            if (!trigger || !trigger.href) return;
   
            var id = trigger.href.replace(noiseexp, '');         
            var divs = document.getElementsByTagName("div");
            for (var i = 0, len = divs.length; i < len; i++){
                if (divs[i].className == (content || contentdefault)){
                    divs[i].className = hidden || hiddendefault;
                }

                if (divs[i].id == id){
                    divs[i].className = content || contentdefault;
                }
            }
        }
    }
}();