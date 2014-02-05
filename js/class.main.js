$(function(){

    // Model for Furnitures
    var Furniture = Backbone.Model.extend({
        // Will contain 3 attributes.
        // These are their default values (not compulsory)
        defaults:{
            dimension:'0 cm',
            name: 'My furniture',
            id: '0000'
        }
    });

    // Create a collection of Furnitures
    var FurnitureCollection = Backbone.Collection.extend({
        // Will hold objects of the Dimension model
        model: Furniture,
        // From:
        url: 'data.json',

        // Redefining parse to suit jsonModel
        parse: function(response){
            return response.items;
        },

        //Added a filter to select all Furnitures by a given dimension
        byDimension: function(dimension) {
            filtered = this.filter(function(Furniture) {
                return Furniture.get("dimension") === dimension;
            });
            return new FurnitureCollection(filtered);
        }
    });
    var furnitures = new FurnitureCollection();

    // This view turns a Furniture model into HTML. Will create LI elements.
    var FurnitureView = Backbone.View.extend({
        tagName: 'li',

        render: function(){

            // Create the HTML
            this.$el.html(this.model.get('name') + ': <span>' + this.model.get('dimension') + '</span>');

            return this;
        }

    });

    // The main view of the application
    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#main'),

        initialize: function(){

            // Cache these selectors
            this.list = $('#furnitures');

            // Listen for the change event on the collection.
            // This is equivalent to listening on every one of the
            // furniture objects in the collection.
            this.listenTo(furnitures, 'change', this.render);

            // Fetch JSON datas
            var that = this;
            furnitures.fetch(
                {
                    success: function () {
                        that.showFurnitures();
                    } ,
                    complete: function(xhr, textStatus) {
                        console.log(textStatus);
                    },
                    error: function(e) {
                        console.log('Failed to fetch!');
                    }  });



        },

        // Create views for every one of the furnitures in the
        // collection and add them to the page
        showFurnitures: function(){
            //furnitures.byDimension('15 cm').each.... to filter
            furnitures.each(function(furniture){
                var view = new FurnitureView({ model: furniture });
                this.list.append(view.render().el);
            }, this);	// "this" is the context in the callback
        }

    });

    new App();

});