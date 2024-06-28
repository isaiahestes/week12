// Create a full CRUD application of your choice using an API or JSON Server.
// Use JQuery/AJAX to interact with the API. 
// Use a form to post new entities.
// Build a way for users to update or delete entities.
// Include a way to get entities from the API.
// Use Bootstrap and CSS to style your project.

class Hero{
    constructor(name, power) {
        this.name = name;
        this.power = power;
    }
}
// Here we add all the services that we need to to add and reomve heros from the api
class HeroService {
    static url = 'https://667dd895297972455f667f3a.mockapi.io/api/hero/Hero'
    static get AllHeros(){
        return $get(this.url);
    }
    static getAllHeros(){
        return $.get(this.url);
    }
    static getHero(id){
        return $.get(`${this.url}/${id}`);
    }
    static createHero(hero){
        return $.post(this.url, hero);
    }
    static updateHero(id, hero){
        return $.ajax({
            url: `${this.url}/${id}`,
            dataType: 'json',
            method: 'PUT',
            data: JSON.stringify(hero),
            contentType: 'application/json',
        })
    }
    static deleteHero(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}
class DOMManager{
    static heros;
    static getAllHeros(){
        HeroService.getAllHeros().then(heros => this.render(heros));
    }
// Here is where i will render the list of heros that are in the database
    static render(heros){
        this.heros = heros;
        $('#app').empty();
        // we will run a loop to get each hero
        for (let hero of heros){
            $('#app').prepend(
                `<div id="${hero.id}" class="card">
                    <div class="card-header">
                        <h2>HERO: ${hero.name}</h2>
                        <h2>POWER: ${hero.power}</h2>
                        <button class="btn btn-primary" onclick="DOMManager.editHero('${hero.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHero('${hero.id}')">Delete</button>                        
                    </div>
                    <div id="edit-hero"></div>
                </div><br>`
            );
        }
    }
    // this is the action that is tied to the delete button which we use heroservices delete then we rerendor the heros
    static deleteHero(id){
        HeroService.deleteHero(id).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }
    // this is the action that is tied to the edit button we collect the data that was edited.
    static editHero(id){
        $('#edit-hero').prepend(
            `<div>
                <input type="text" id="name" value="${this.heros.find(hero => hero.id == id).name}">
                <input type="text" id="power" value="${this.heros.find(hero => hero.id == id).power}">
                <button class="btn btn-primary" onclick="DOMManager.updateHero('${id}')">Update</button>                
            </div>`
        );
    }
// this is the method that is called in edithero which we use heroservices update then we rerendor the heros
    static updateHero(id){
        let name = $('#name').val();
        let power = $('#power').val();
        HeroService.updateHero(id, {name, power}).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }
// this is the method that is called in add button which we use heroservices create then we rerendor the heros       
    static createHero(name,power){
        let hero = {name:name,power:power};
        HeroService.createHero(hero).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }

}
// this is the on click for the add button
$('#create-new-hero').click(()=>{
    DOMManager.createHero($('#new-hero-name').val(),$('#new-hero-power').val())
    $('#new-hero-name').val('')
    $('#new-hero-power').val('')
});
DOMManager.getAllHeros();