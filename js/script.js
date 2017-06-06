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

        $(".textbox").html(""); // hide the textbox when closing

        function removeClassTimeout(elem){
            setTimeout(function() {
                $(elem).removeClass("selected");
            }, 200);
        }
    });

    $(".pyramid__block").on("mouseenter",function(){ // Change text box when hovering over a pyramid block
        if ($(this).hasClass("selected") != true){ // disable if card is selected
            getBookData($(this)["0"].outerText);
            $(".textbox").html("<p>"+categoryInfo[$(this)["0"].outerText]+"</p>"); // change the html to the info given in the categoryInfo object
        }
    });




    function initialiseCard(pyramidElem){ // creates the opened card look
        var cardCategory = pyramidElem.children("h1")["0"].innerHTML; // get the category ( eg. Philosophy, Mindfulness)
        pyramidElem.append("<div class='booklist__wrap'></div>") // create booklist wrapper
        pyramidElem.children("h1").fadeOut(500); // hide category tag
        

        setTimeout(function() { // animate appearing of booklist
            pyramidElem.children(".booklist__wrap").animate({opacity:"1"},1200);
            pyramidElem.children(".close").show(400);
            createBooklist(cardCategory, pyramidElem.children(".booklist__wrap")); // run createbooklist to append books to wrapper
        }, 500);

      

    }


    function createBooklist(booklistIdentifier, elem){ // given the category, eg. mindfulness, philosophy, and element to append to, creates a list of books from the object.
        var booklist = eval("booklist"+booklistIdentifier); // use identifier to select the correct object

        for (key in booklist){ // iterate through the book list, creating a div for each with the given data
            if(booklist[key].img != undefined){
                elem.append("<div class='booklist__book'><img src='"+ booklist[key].img + "'><div class='stars'>"+convertRatingToHTML(booklist[key].rating)+"</div><h3>"+ key +"</h3></div>")
            } else{
                elem.append("<div class='booklist__book'><img src=''><div class='stars'>"+convertRatingToHTML(booklist[key].rating)+"</div><h3>"+ key +"</h3></div>")
            }
        }

        bindHoverEventsToBooks();


    }

    function bindHoverEventsToBooks(){
        
        for (var i =0 ; i < $(".booklist__book").length; i++){
            var book = $(".booklist__book")[i]


            $(book).on("mouseenter",function(){ // Change text box when hovering over a book
                var categoryTitle = $(book).parent().siblings("h1")[0].innerHTML;
                var bookTitle = $(this).children("h3")[0].innerHTML;
                var booklistData = eval("booklist"+categoryTitle);


                $(".textbox").html("<div class='stars'>"+convertRatingToHTML(booklistData[bookTitle].rating)+"</div>")
                $(".textbox").append("<h3>"+bookTitle+"</h3>"); // change the html to the info given in the categoryInfo object
                $(".textbox").append("<p>"+booklistData[bookTitle].info+"</p>")

                setTimeout(function() { // setTimeout to allow data to be sent
                    if (booklistData[bookTitle].pageCount){ // if a pagecount could be found then append the pagecount
                         $(".textbox").append("<p>Pagecount: "+booklistData[bookTitle].pageCount+"</p>"); 
                    }


                }, 0);


             });
        }
    }

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



        function convertGoogleAPISearch(string){ // converts string of title into usable google books link
            var link = "https://www.googleapis.com/books/v1/volumes?q="; // base link
            link += string.split(" ").join("+"); // change spaces to +
            link +="&key=AIzaSyChdVGDhzBUrSxOl89lX0KjnCccMF-Hafs"
            return link; // return link
        };

        function googleBooksSearch(title, author){ // return results from book search

            var result = [];

             $.getJSON(convertGoogleAPISearch(title), function (response) { // search using convertGoogleAPISearch of title
                for (var i = 0; i < response.items.length; i++) { // iterate through items
                    var item = response.items[i];

                    if (item.volumeInfo.authors == author && item.volumeInfo.title == title){

                        if(item.volumeInfo.imageLinks != undefined){
                            var resultArray = [item.volumeInfo.pageCount, item.volumeInfo.imageLinks.thumbnail]
                            result.push(resultArray);
                        }
                            

                        // console.log(result);
                    }
                }

                

                
                // return result.pageCount;
                
             });
            //  console.log(result)
           return result
        }
        // googleBooksSearch("Waking Up", "Sam Harris");


        function getBookData(category){
            var list = eval(("booklist"+category));
            
            for (key in list){
                var result = googleBooksSearch(key, list[key].author);
                if (result.length > 1){
                    result = result[0];
                }
                saveResult(list[key], result)
                setTimeout(saveResult(list[key], result), 1000);
            }

            function saveResult(objectEntry, array){
                setTimeout(function() {
                    if (array.length > 0){
                        objectEntry.pageCount = array[0][0];
                        objectEntry.img = array[0][1];
                    } else{
                        objectEntry.pageCount = array[0];
                        objectEntry.img = array[1];

                    }
                }, 1000);

            }

        }
        

// Data for categories:

    var categoryInfo = {
        Philosophy: "this",
        Mindfulness: "other",
        Principles: "yep",
        Body: "dope",
        Social: "intense",
        Wealth: "epic"
    };



// Data for books: 


    // Philosophy:

    var booklistPhilosophy = {
            "Mindfulness for Beginners: Reclaiming the Present Moment—and Your Life": {
                "author": "Jon Kabat-Zinn",
                "rating": 4.5,
                "info": "This is all about it!",
            },
            "Full Catastrophe Living" : {
                "author": "Jon Kabat-Zinn",
                "rating": 4,
                "info": "Other words about this one.",
            },
            "Waking Up" : {
                "author": "Sam Harris",
                "rating": 3,
                "info": "Other words about this one.",
            },
            
    }

        // Mindfulness:

    var booklistMindfulness = {
            "Mindfulness for Beginners" : {
                "author": "Jon Kabat-Zinn",
                "rating": 4.5,
                "info": "This is all about it!",
            },
            "Full Catastrophe Living" : {
                "author": "Jon Kabat-Zinn",
                "rating": 4,
                "info": "Other words about this one.",
            },
            "Waking Up" : {
                "author": "Sam Harris",
                "rating": 3,
                "info": "Other words about this one.",
            },
            
    }
        // Principles:

    var booklistPrinciples = {
            "The 80/20 Principle" : {
                "author": "Richard Koch",
                "rating": 0,
                "info": "Nice book!",
            },
            
    }
        // Body:

    var booklistBody = {
            "Spark" : {
                "author": "John J. Ratey",
                "rating": 2.5,
                "info": "Good info, too long and wind out for what should be simple information to convey.",
            },
            
    }
        // Social:

    var booklistSocial = {
            "How to Win Friends and Influence People" : {
                "author": "Dale Carnegie",
                "rating": 5,
                "info": "Just a great book.",
            },
            
    }
        // Wealth:

    var booklistWealth = {
            "Rich Dad Poor Dad" : {
                "author": "Robert T. Kiyosaki",
                "rating": 3,
                "info": "Decent.",
            },
            
    }
        

})  // End Document Ready


