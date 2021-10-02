package com.mycompany.projeto.artefato.sprint;

public class Autenticacao {

    private String email = "felipecruz@gmail.com";
    private String senha = "*****";
    private String maquina = "***";

    public boolean autenticar(String inptemail, String inptsenha, String inptmaquina) {

        return inptemail.equals(this.email) && inptsenha.equals(this.senha)
                && inptmaquina.equals(this.maquina);
    }

}

