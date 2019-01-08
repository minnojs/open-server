define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.1/IAT/iat6.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();
    var global = API.getGlobal();

    return iatExtension({
        category1 : {
            name : 'Arab Muslims', //Will appear in the data.
            title : {
                media : {word : 'Arab Muslims'}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: 'Hakim'},
                {word: 'Sharif'},
                {word: 'Yousef'},
                {word: 'Wahib'},
                {word: 'Akbar'},
                {word: 'Muhsin'},
                {word: 'Salim'},
                {word: 'Karim'},
                {word: 'Habib'},
                {word: 'Ashraf'}  
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },    
        category2 :    {
            name : 'Other People', //Will appear in the data.
            title : {
                media : {word : 'Other People'}, //Name of the category presented in the task.
                css : {color:'#31940F','font-size':'1.8em'}, //Style of the category title.
                height : 4 //Used to position the "Or" in the combined block.
            }, 
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: 'Ernesto'},
                {word: 'Matthais'},
                {word: 'Maarten'},
                {word: 'Philippe'},
                {word: 'Guillame'},
                {word: 'Benoit'},
                {word: 'Takuya'},
                {word: 'Kazuki'},
                {word: 'Chaiyo'},
                {word: 'Marcelo'}
            ],
            //Stimulus css (style)
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        attribute1 : {
            name : 'Bad',
            title : {
                media : {word : 'Bad'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.negWords[0]},
                {word: global.negWords[1]},
                {word: global.negWords[2]},
                {word: global.negWords[3]},
                {word: global.negWords[4]},
                {word: global.negWords[5]},
                {word: global.negWords[6]},
                {word: global.negWords[7]}

            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Good',
            title : {
                media : {word : 'Good'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4 //Used to position the "Or" in the combined block.
            },
            stimulusMedia : [ //Stimuli content as PIP's media objects
                {word: global.posWords[0]},
                {word: global.posWords[1]},
                {word: global.posWords[2]},
                {word: global.posWords[3]},
                {word: global.posWords[4]},
                {word: global.posWords[5]},
                {word: global.posWords[6]},
                {word: global.posWords[7]}
            ],
            //Stimulus css
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },

        isTouch : global.$isTouch
    });

});
