$(document).ready(function(){

    $(".pyramid__block").click(function(){ // If user clicks on a pyramid block
        if ($(this).hasClass("selected") == false){ // if not currently selected

            $(this).addClass("selected");   // add selected calss

            for(var i=0; i<$(".pyramid__block").length;i++){ // iterate through blocks, find non selected elems
                var elem = $(".pyramid__block")[i]
                if(elem.classList.contains("selected") != true){
                    $(elem).animate({opacity:"0"}, 150); // animate opacity to 0

                    hideTimeout(elem); // run timeout to hide elems
                }
            }

            function hideTimeout(elem){ // waits x ms to then hide over y ms
                setTimeout(function() {
                    $(elem).hide(200);
                }, 300);
            }

        
            $(this).animate({ height:"400px"}, 600); // animate the height of the card
            $(this).animate({width:"60%"}, 100); // animate the width

            initialiseCard($(this)); // run the initialise function
            
        }

        
    });

    $(".close").click(function(){
        var elem = $(this).parent();
        $(".booklist__wrap").remove();
        $(this).hide();
        $(elem).animate({ height:"115px", width: "115px"}, 600);
        elem.children("h1").show(900);
        

        for(var i=0; i<$(".pyramid__block").length;i++){ // iterate through blocks, find non selected elems
                $($(".pyramid__block")[i]).show(400);
                $($(".pyramid__block")[i]).animate({opacity:"1"},50); // animate opacity to 0
        }
        
        removeClassTimeout(elem);

        function removeClassTimeout(elem){
            setTimeout(function() {
                $(elem).removeClass("selected");
            }, 200);
        }
    });

    function initialiseCard(pyramidElem){ // creates the opened card look
        var cardCategory = pyramidElem.children("h1")["0"].innerHTML; // get the category ( eg. Philosophy, Mindfulness)
        pyramidElem.append("<div class='booklist__wrap'></div>") // create booklist wrapper
        pyramidElem.children("h1").fadeOut(500); // hide category tag

        setTimeout(function() { // animate appearing of booklist
            pyramidElem.children(".booklist__wrap").animate({opacity:"1"},1200);
            pyramidElem.children(".close").show(400);

        }, 500);

        createBooklist(cardCategory, pyramidElem.children(".booklist__wrap")); // run createbooklist to append books to wrapper
    }


    function createBooklist(booklistIdentifier, elem){ // given the category, eg. mindfulness, philosophy, and element to append to, creates a list of books from the object.
        var booklist = eval("booklist"+booklistIdentifier); // use identifier to select the correct object
        
        function convertRatingToHTML(number){   // return a HTML representation of the rating given
            var html =""; // variable to return once built

            for(var i=0; i < Math.floor(number); i++){ // Create whole stars based on integers
                html += "<span class='icon-star'></span>"
            }

            if (5 - number != 0){ // IF rating is not 5, continue building on HTML:

                // Check if the rating is an integer, if it is: finish rating off with empty stars
                if (5 - number == Math.floor(5 - number)){ 
                    for(var i=0; i < 5 - number; i++){ 
                        html += "<span class='icon-star_border'></span>"
                    }

                } else{ 
                    if( Math.floor(5 - number) > 0){ // IF rating is < 4.5, then add half star + full stars
                        html += "<span class='icon-star_half'></span>";

                        for(var i=0; i < Math.floor(5 - number); i++){ 
                            html += "<span class='icon-star_border'></span>"
                        }
                    } else{ // else, if rating is 4.5, add one half star
                        html += "<span class='icon-star_half'></span>"
                    }

                }
                

            } 
            return html;
        }

        for (key in booklist){ // iterate through the book list, creating a div for each with the given data
        
            elem.append("<div class='booklist__book'><img src='"+ booklist[key].img + "'><div class='stars'>"+convertRatingToHTML(booklist[key].rating)+"</div><h3>"+ key +"</h3></div>")
        }
    }


    // Data for books: 

        // Mindfulness:

    var booklistMindfulness = {
            "Mindfulness For Beginners" : {
                "author": "Jon Kabat-Zinn",
                "rating": 4.5,
                "info": "This is all about it!",
                "img": "https://images-na.ssl-images-amazon.com/images/I/61UqeO8uB2L._SY344_BO1,204,203,200_.jpg", 
            },
            "Full Catastrophe Living" : {
                "author": "Jon Kabat-Zinn",
                "rating": 4,
                "info": "Other words about this one.",
                "img": "https://images-na.ssl-images-amazon.com/images/I/518aO1WfFvL._SX330_BO1,204,203,200_.jpg", 
            },
            "Waking Up" : {
                "author": "Sam Harris",
                "rating": 3,
                "info": "Other words about this one.",
                "img": "https://images-na.ssl-images-amazon.com/images/I/5113lJZJQuL._SX326_BO1,204,203,200_.jpg", 
            },
            
    }

})  // End Document Ready


