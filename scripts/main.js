$(function () {
    //----------------------------------------
    // Inicializamos highlight.js
    hljs.configure({ useBR: true });
    document.querySelectorAll('#code_area').forEach((block) => {
        hljs.highlightBlock(block);
    });
    $(":input").on('change', function (e) {
        //------------------------------------------
        // declaramos las variables
        let loop_start = $("#input_for_start").val();
        let loop_end = $("#input_for_end").val();
        let loop_increment = $("#input_for_increment").val();
        let loop_iterator = $("#input_for_i").val();
        let loop_comparator = $("input[type='radio']:checked").val();
        let loop_increment_sign;
        //-----------------------------------------
        // creamos el texto para el incremento del loop
        if (loop_increment == "1") {
            loop_increment_sign = "++";
        }
        else {
            if (loop_increment == "-1") {
                loop_increment_sign = "--";
            }
            else {
                if (loop_increment.includes("-")) {
                    loop_increment_sign = " = " + loop_iterator + " - " + loop_increment.substring(1);
                }
                else {
                    loop_increment_sign = " = " + loop_iterator + " + " + loop_increment;
                }
            }
        }
        //------------------------------------------------
        // validamos lo basico
        let valid_comparator = true;
        let infinite_execution = false;
        let one_time_execution = false;
        // Si el inicio es mayor que el final
        if (Number(loop_start) > Number(loop_end)) {
            if (loop_comparator.includes("<")) {
                // si el signo contine < (ejemplo: 10<6 )
                // entonces el comparador no es valido
                valid_comparator = false;
            }
            else {
                //si el comparador si es valido
                if (!loop_increment.includes("-")) {
                    //verificamos que el incremento sea positivo 
                    // ejemplo: desde i=10; i > 5 con paso 1
                    // si es positivo, es buffer overflow, deberia ser negativo
                    infinite_execution = true;
                }
            }
        }
        // si el inicio es igual al final
        else if (loop_start == loop_end) {
            if (loop_comparator.includes("=")) {
                // si los signos son <= o >=, casos:
                // caso 1) i=5; i>=5; i++ <- se ejecuta hasta infinito
                // caso 2) i=5; i>=5; i-- <-se ejecuta una vez
                // caso 3) i=5; i<=5; i++ <- se ejecuta una vez
                // caso 4) i=5; i<=5; i-- <- se ejecuta hasta el infinito
                // caso 5) i=5; i>=5 o i<=5; i=i+0 <- infinito
                if (loop_comparator.includes(">") && loop_increment.includes("-")) {
                    //caso 2
                    console.log(loop_comparator);
                    console.log(loop_increment);
                    console.log("Se ejecuta una vez... caso 2");
                    one_time_execution = true;
                } else if (loop_comparator.includes("<") && !loop_increment.includes("-")) {
                    //caso 3
                    console.log("Se ejecuta una vez... caso 3");
                    one_time_execution = true;
                }
                else {
                    //casos 1 y 4 y 5
                    console.log("se ejecuta hasta el infinito")
                    infinite_execution = true;
                }


            }
            else {
                // Si nos numeros son iguanes y no hay igual en el comparador
                // ejemplo= 5<5, entonces no es comparador valido y no hay ejecución
                valid_comparator = false;
            }
        }
        // si el inicio es menor al final
        else {
            if (loop_comparator.includes(">")) {
                // Si el comparador es >, ejemplo 5>10
                // entonces es invalido
                valid_comparator = false;
            }
            else {
                // si es valido: 5<10
                if (loop_increment.includes("-")) {
                    //verificamos que el paso sea negativo
                    //ejejmplo: i=5; i<10; i--
                    // si es negativo, lleva al infinito
                    infinite_execution = true;
                }
            }
        }
        // si el incremento es igual a cero causa buffer overflow
        if (Number(loop_increment) == 0) {
            infinite_execution = true;
        }
        let rest_of_loop_code;
        rest_of_loop_code = "<br>    // Muestra valor del iterador<br>    System.out.println(" + loop_iterator + ");<br>}";
        let loop_code = "for (int " + loop_iterator + " = " + loop_start + "; " + loop_iterator + " " + loop_comparator + " " + loop_end + "; " + loop_iterator + loop_increment_sign + "){" + rest_of_loop_code;
        // ejecucion de bucle
        let js_loop_code = "for(" + loop_iterator + "=" + loop_start + "; " + loop_iterator + loop_comparator + loop_end + "; " + loop_iterator + loop_increment_sign + "){x=x+' '+" + loop_iterator + ";}";
        let execution_results = "";
        if (!infinite_execution) {
            let x = "";
            eval(js_loop_code);
            execution_results = "Resultado: " + x;
            if ($("#values_card").hasClass("border-danger")) {
                $("#values_card").toggleClass("border-danger");
            }
        }
        else {
            execution_results = "Resultado: &infin;";
            if (!$("#values_card").hasClass("border-danger")) {
                $("#values_card").toggleClass("border-danger");
            }

            $("#alerts").prepend("<div id='warning-popup'class='alert alert-warning alert-dismissible fade show' role='alert'><strong>Bucle infinito!</strong> La combinación de valores y operadores causa un buffer overflow (ejecucion sin parar).<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
            setTimeout(function () {
                $("#warning-popup").alert("close");
            }, 5000);
        }
        if (!valid_comparator) {
            execution_results = "Sin ejecución";
            if (!$("#comparators_card").hasClass("border-danger")) {
                $("#comparators_card").toggleClass("border-danger");
            }
            $("#alerts").prepend("<div id='danger-popup'class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Comparador incompatible!</strong> Intenta cambiar el signo de la relación entre iterador y valor final, y el signo del incremento.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
            setTimeout(function () {
                $("#danger-popup").alert("close");
            }, 3000);
        } else {
            if ($("#comparators_card").hasClass("border-danger")) {
                $("#comparators_card").toggleClass("border-danger");
            }
        }
        if (one_time_execution) {
            $("#alerts").prepend("<div id='info-popup'class='alert alert-info alert-dismissible fade show' role='alert'><strong>Ejecución unica!</strong> Tu codigo dentro del bucle solo se ejecutará una vez.<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>");
            setTimeout(function () {
                $("#info-popup").alert("close");
            }, 3000);
        }
        $("#execution_results").html(execution_results);
        $("#code_area").html(loop_code);
        document.querySelectorAll('#code_area').forEach((block) => {
            hljs.highlightBlock(block);
        });
        // cambio de estilos de los botones de relación
        label = $("input[type='radio']:checked").parent()
        if (label.hasClass("btn-secondary")) {
            $("label").removeClass("btn-primary");
            $("label").addClass("btn-secondary")
            label.removeClass("btn-secondary");
            label.addClass("btn-primary");
        } else {
            label.removeClass("btn-primary");
            label.addClass("btn-secondary");
        }
    });
});
