$(document).ready(function () {
    hljs.configure({ useBR: true });
    document.querySelectorAll('#code_area').forEach((block) => {
        hljs.highlightBlock(block);
    });
    $(":input").on('change', function (e) {
        let loop_start = $("#input_for_start").val();
        let loop_end = $("#input_for_end").val();
        let loop_increment = $("#input_for_increment").val();
        let Loop_iterator = $("#input_for_i").val();
        let loop_comparator = $("input[type='radio']:checked").val();
        if (loop_increment == "1") {
            loop_increment_sign = "++";
        }
        else {
            if (loop_increment == "-1") {
                loop_increment_sign = "--";
            } else {
                if (loop_increment.includes("-")) {
                    loop_increment_sign = " = " + Loop_iterator + " - " + loop_increment.substring(1);
                }
                else {
                    loop_increment_sign = " = " + Loop_iterator + " + " + loop_increment;
                }

            }
        }
        //validacion
        let runable_code = true;
        let valid_comparator = true;
        let valid_increment = true;
        let infinite_execution = false;
        if (Number(loop_start) > Number(loop_end)) {
            console.log("primer caso");
            if (loop_comparator.includes("<")) {
                valid_comparator=false;
            } else {
                if (!loop_increment.includes("-")) {
                    infinite_execution = true;
                } else {
                    console.log("El codigo se ejecutará correctamente");
                }
            }
        } else if (loop_start == loop_end) {
            console.log("segundo caso");
            if (loop_comparator.includes("=")) {
                console.log("Se ejecuta una vez");
            }else{
                valid_comparator=false;
            }
        }
        else {
            console.log("tercer caso")
            if (loop_comparator.includes(">")) {
                valid_comparator=false;
            } else {
                if (loop_increment.includes("-")) {
                    infinite_execution = true;
                } else {
                    console.log("El codigo se ejecutará correctamente");
                }
            }
        }
        if(Number(loop_increment)==0){
            infinite_execution = true;
        }
        rest_of_loop_code = "<br>    // Muestra valor del iterador<br>    System.out.println(" + Loop_iterator + ");<br>}"
        let loop_code = "for (int " + Loop_iterator + " = " + loop_start + "; " + Loop_iterator + " " + loop_comparator + " " + loop_end + "; " + Loop_iterator + loop_increment_sign + "){" + rest_of_loop_code;
        // ejecucion de bucle
        
        let js_loop_code = loop_code.replace("System.out.println("+Loop_iterator+");", "x=x+' '+" + Loop_iterator + ";");
        js_loop_code = js_loop_code.replace("int", "");
        js_loop_code = js_loop_code.replace(/<br>/g, "");
        js_loop_code = js_loop_code.replace("// Muestra valor del iterador", "");
        console.log(js_loop_code);
        let x = "";
        if (!infinite_execution) {
            x="Resultado: ";
            eval(js_loop_code);
        } else{
            x="Resultado: &infin;"
            $("#alerts").prepend("<div id='warning-popup'class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Bucle infinito!</strong> La combinación de valores y operadores causa un buffer overflow (ejecucion sin parar).<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
            setTimeout(function(){
                $("#warning-popup").alert("close");
              }, 5000);
        }
        if(!valid_comparator){
            x="Sin ejecución"
            $("#alerts").prepend("<div id='danger-popup'class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Comparador incompatible!</strong> Intenta cambiar el signo de la relación entre iterador y valor final, y el signo del incremento.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
            setTimeout(function(){
                $("#danger-popup").alert("close");
              }, 3000);
        }
        execution_results = x;
        $("#execution_results").html(execution_results);
        $("#code_area").html(loop_code);
        document.querySelectorAll('#code_area').forEach((block) => {
            hljs.highlightBlock(block);
        });
    });
});
