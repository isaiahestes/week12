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

    static render(heros){
        this.heros = heros;
        $('#app').empty();
        for (let hero of heros){
            $('#app').prepend(
                `<div id="${hero.id}" class="card">
                    <div class="card-header">
                        <h2>${hero.name}</h2>
                        <h1>${hero.power}</h2>
                        <button class="btn btn-primary" onclick="DOMManager.editHero('${hero.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="DOMManager.deleteHero('${hero.id}')">Delete</button>                        
                    </div>
                    <div id="edit-hero"></div>
                </div><br>`
            );
        }
    }
    static deleteHero(id){
        HeroService.deleteHero(id).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }

    static editHero(id){
        $('#edit-hero').prepend(
            `<div>
                <input type="text" id="name" value="${this.heros.find(hero => hero.id == id).name}">
                <input type="text" id="power" value="${this.heros.find(hero => hero.id == id).power}">
                <button class="btn btn-primary" onclick="DOMManager.updateHero('${id}')">Update</button>                
            </div>`
        );
    }
    static updateHero(id){
        let name = $('#name').val();
        let power = $('#power').val();
        HeroService.updateHero(id, {name, power}).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }
    static createHero(name,power){
        let hero = {name:name,power:power};
        HeroService.createHero(hero).then(() =>{
            return HeroService.getAllHeros();
        })
        .then(heros => this.render(heros));
    }

}
$('#create-new-hero').click(()=>{
    DOMManager.createHero($('#new-hero-name').val(),$('#new-hero-power').val())
    $('#new-hero-name').val('')
    $('#new-hero-power').val('')
});
DOMManager.getAllHeros();