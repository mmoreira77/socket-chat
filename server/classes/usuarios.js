class Usuarios{
    
    constructor(){
        this.personas = [];
    };

    agregarPersona(id, nombre, sala){
        let persona = {id, nombre, sala};
        this.personas.push(persona);        

        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter(per => per.id === id)[0];
        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
               
        let datos = this.personas.filter(per => per.sala === sala);
        return datos;        
    }

    borrarPersonas(id){
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(per => {
            return per.id != id
        });
        return personaBorrada;
    }
}

module.exports = {
    Usuarios
}