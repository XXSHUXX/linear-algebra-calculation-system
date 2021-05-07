$(document).ready(function(){
    let vector_input_divs = $(".vector-input-div");
    let vector_calculation_div = $(".vector-calculation-div").eq(0);
    let vector_result_div = $(".vector-result-div").eq(0);
    let multi_calculation_div = $('.multi-calculation-div').eq(0);
    let page_title = $("#page-title");

    set_input_zone(3);

    $('#confirm-vector-size').on('click', function () {
        let calculationType = $("#vector-calculation-type").val();
        switch (calculationType) {
            case "plus":
            case "minus":
                set_data_attribute(vector_result_div, 'template', 'vector-result-template');
                break;
            case "multi":
                set_data_attribute(vector_result_div, 'template', 'multi-result-template');
                break;
        }
        set_data_attribute(page_title, 'translation', "vector_" + calculationType);
        set_vector_operator(calculationType);
        page_title.text(messages["vector_" + calculationType]);
        set_input_zone(get_size_number($("#vector-size-input").val()));
    });

    $('#do_calc').on('click', function () {
        clear_calc_zone();

        let vector = [];
        vector[0] = [];
        vector[1] = [];
        vector_input_divs.each(function (i) {
            let i_element = $(this);
            i_element.find('input').each(function (j) {
                let j_element = $(this);
                vector[i][j] = get_value_number(j_element.val());
            });
        });

        let result_vector = [];
        let size = vector[0].length;
        let multi_result = null;
        let operator = " + ";
        switch (page_title.data('translation')) {
            case "vector_plus":
                operator = " + ";
                for (let i = 0; i < size; i++){
                    result_vector[i] = vector[0][i] + vector[1][i];
                }
                break;
            case "vector_minus":
                operator = " - ";
                for (let i = 0; i < size; i++){
                    result_vector[i] = vector[0][i] - vector[1][i];
                }
                break;
            case "vector_multi":
                operator = " * ";
                multi_result = 0;
                for (let i = 0; i < size; i++){
                    result_vector[i] = vector[0][i] * vector[1][i];
                    multi_result += result_vector[i];
                }
                break;
        }


        let vectorCalcDivs = [];

        if (multi_result != null) {
            vectorCalcDivs[0] = multi_calculation_div;
            clone_and_set(vector_result_div, multi_result);

            for (let i = 0; i < size; i++){
                clone_and_set(multi_calculation_div, vector[0][i] + operator +  _minus_value(vector[1][i]));
                if (i !== size - 1){
                    clone_and_set(multi_calculation_div, "+");
                }
            }
            
            clone_and_set(multi_calculation_div, "=");
            
            clone_and_set(multi_calculation_div, multi_result);
        } else {
            vectorCalcDivs[0] = vector_calculation_div;
            for (let i = 0; i < size; i++){
                clone_and_set(vector_calculation_div,
                    vector[0][i] + operator +  _minus_value(vector[1][i])
                );
            }

            for (let i = 0; i < size; i++){
                clone_and_set(vector_result_div, result_vector[i]);
            }
        }

        vectorCalcDivs[1] = vector_result_div;
        for (let vectorCalcDiv of vectorCalcDivs) {
            vectorCalcDiv.hide();
        }

        for (let i = 0; i < vectorCalcDivs.length; i++) {
            vectorCalcDivs[i].delay(i * 1000).fadeIn(500);
        }


    });

    function set_vector_operator(calculationType) {
        let value = "+";
        switch (calculationType) {
            case "plus":
                value = "+";
                break;
            case "minus":
                value = "-";
                break;
            case "multi":
                value = "∙";
                break;
        }
        $("#vector-operator").val(value);
    }
    function clone_and_set(target_div, value) {
        let clone = make_clone(target_div.data('template'));
        clone.value = value;
        clone.disabled = true;
        target_div.append(clone);
    }

    function clear_input_zone() {
        vector_input_divs.each(function () {
            $(this).empty();
        });
    }

    function clear_calc_zone() {
        vector_calculation_div.empty();
        multi_calculation_div.empty();
        vector_result_div.empty();
    }

    function set_input_zone(size) {
        clear_input_zone();
        clear_calc_zone();

        vector_input_divs.each(function () {
            for (let i = 0; i < size; i++) {
                let clone = make_clone($(this).data('template'));
                clone.value = randomNum(-5, 5);
                $(this).append(clone);
            }
        });
    }

});