import React from 'react'
import api from '../api'

const Login = () => {
    const handleSubmit = values => console.log(values)
   
      useEffect(() => {
        api
          .post("/login",{
                username: "amarelo",
                password: "amarelo"
     })
          .then((response) => setUser(response.data))
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
          });
      }, []);
    return(
        <>
            <h1>Login</h1>
            <p>Preencha os campos para continuar ...</p>
            {/* <form class="Form" action="http://localhost:5412/API/login" method="Post"> */}
                <div className="Form-Group">
                <div class="input-field col s12">
                <h6>USUÁRIO</h6>
                <input id="username" name="username" type="text" class="validate"/>
                
              </div>
              <div class="input-field col s12">
                <h6>SENHA</h6>
                <input id="password" name="password" type="password" class="validate"/>
               
              </div>
                    <field
                        name='username'
                        className="Form-Field"
                    />

                </div>
                <button className="Form-Btn" type="submit">Login</button>
            {/* </form> */}
        </>
    )
}

export default Login