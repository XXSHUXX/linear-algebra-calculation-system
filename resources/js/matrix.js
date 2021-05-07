$(document).ready(function(){
    let matrix_size_input = [$('.first-matrix-size'), $('.second-matrix-size')];
    let calculation_type = $('#calculation-type');
    let matrix_show_divs = $('.matrix-show-div');
    let vector_show_divs = $('.vector-show-div');
    let title = $("#title");
    let step_control_button = $(".step-control-button");
    let currentStep = 0, maxStep = 1;
    let inputMatrices = [], outputMatrix;
    let calcVector, resultVector, multiVector;
    let firstTimeCalc = true;

    matrix_size_input[1].attr('disabled', 'disabled');

    step_control_button.prop( "disabled", true);

    for (let i = 0; i < 3; i++){
        draw_matrix(i, 3, 3);
    }
    draw_vector(3);

    $("#do_calc").on('click', function () {
        if (!firstTimeCalc){
            if (!confirm(messages['alert_calc'])){
                return false;
            }
        }
        firstTimeCalc = false;
        step_control_button.visible();
        $("#do_back").prop("disabled", true);
        $("#do_next").prop("disabled", false);
        currentStep = 0;
        let input_cnt = 0;
        matrix_show_divs.each(function (cnt) {
            let currentMatrixDiv = new MatrixDiv($(this), cnt, getCalcType());
            if (currentMatrixDiv.isInputDiv){
                inputMatrices[input_cnt++] = currentMatrixDiv;
            } else if (currentMatrixDiv.isOutputDiv) {
                outputMatrix = currentMatrixDiv;
            }
        });
        outputMatrix.clear();
        vector_show_divs.each(function (number) {
            let currentVector = new VectorDiv($(this), number);
            currentVector.clear();
            if (VectorDiv.testCalcVector(number)){
                calcVector = currentVector;
            } else if (VectorDiv.testMultiVector(number)){
                multiVector = currentVector;
            } else if (VectorDiv.testResultVector(number)){
                resultVector = currentVector;
            }
        });
        switch (getCalcType()) {
            case 0:
            case 1:
            case 4:
                maxStep = inputMatrices[0].getMatrix().width;
                break;
            case 2:
                maxStep = inputMatrices[0].getMatrix().height * inputMatrices[1].getMatrix().width;
                break;
        }
        updateMatrixByStep(currentStep);
    });

    step_control_button.on('click', function () {
        if ($(this).data('translation') === "next"){
            currentStep++;
        } else {
            currentStep--;
        }
        console.log(currentStep + " " + maxStep);

        if (currentStep !== maxStep){
            $("#do_next").prop( "disabled", false);
        }
        if (0 !== currentStep){
            $("#do_back").prop( "disabled", false);
        }

        if (0 === currentStep || currentStep === maxStep - 1){
            $(this).prop( "disabled", true);
        }

        updateMatrixByStep(currentStep);
    });

    for (let i = 0; i < 2; i++){
        matrix_size_input[0].eq(i).on('change', function (){
            switch (calculation_type.val()) {
                case "plus":
                case "minus":
                    matrix_size_input[1].eq(i).val($(this).val());
                    break;
                case "multi":
                    if (1 === i) {
                        matrix_size_input[1].eq(0).val($(this).val());
                    }
                    break;
            }
        });
    }
    matrix_size_input[0].eq(0).on('change', function (){
        if ("inverse" === calculation_type.val()){
            matrix_size_input[0].eq(1).val($(this).val());
        }
    });

    $('#confirm-calculation-type').on('click', function () {
        step_control_button.invisible();
        firstTimeCalc = true;
        //plus minus multi output matrix
        let pmm_output_matrix = matrix_show_divs.eq(2);
        step_control_button.prop( "disabled", true);
        set_data_attribute(title, 'translation', "matrix_" + calculation_type.val());
        title.text(messages["matrix_" + calculation_type.val()]);

        let first_matrix_height = get_size_number(matrix_size_input[0].eq(0).val());
        let first_matrix_width = get_size_number(matrix_size_input[0].eq(1).val());
        let second_matrix_width = get_size_number(matrix_size_input[1].eq(1).val());
        _set_vector_div();
        _set_operators();
        switch (calculation_type.val()) {
            case "plus":
            case "minus":
                pmm_output_matrix.show();
                for (let i = 0; i < 3; i++){
                    draw_matrix(i, first_matrix_height, first_matrix_width);
                }
                draw_vector(first_matrix_height);
                break;
            case "multi":
                pmm_output_matrix.show();
                draw_matrix(0, first_matrix_height, first_matrix_width);
                // noinspection JSSuspiciousNameCombination
                draw_matrix(1, first_matrix_width, second_matrix_width);
                draw_matrix(2, first_matrix_height, second_matrix_width);
                draw_vector(first_matrix_width);
                break;
            case "inverse":
                pmm_output_matrix.hide();
                for (let i = 0; i < 2; i++){
                    // noinspection JSSuspiciousNameCombination
                    draw_matrix(i, first_matrix_height, first_matrix_height);
                }
                break;
            case "transpose":
                pmm_output_matrix.hide();
                draw_matrix(0, first_matrix_height, first_matrix_width);
                // noinspection JSSuspiciousNameCombination
                draw_matrix(1, first_matrix_width, first_matrix_height);
                break;
        }

        function _set_vector_div() {
            let vector_anime_div = $("#vector-anime-div");
            switch (calculation_type.val()) {
                case "plus":
                case "minus":
                case "multi":
                    vector_anime_div.show();
                    break;
                case "inverse":
                case "transpose":
                    vector_anime_div.hide();
                    break;
            }
        }

        function _set_operators(){
            let operators = $(".operator");
            switch (calculation_type.val()) {
                case "plus":
                    operators.visible();
                    operators.eq(0).val('+');
                    break;
                case "minus":
                    operators.eq(0).val('-');
                    break;
                case "multi":
                    operators.eq(0).val('*');
                    break;
                case "inverse":
                case "transpose":
                    operators.invisible();
                    break;
            }
        }
    });

    calculation_type.on('change', function () {
        let second_size_div = $('#second-size-div');

        for (let i = 0; i < 2; i++){
            matrix_size_input[i].val('');
        }
        matrix_size_input[0].removeAttr('disabled');
        matrix_size_input[1].attr('disabled', 'disabled');
        switch ($(this).val()) {
            case "plus":
            case "minus":
                second_size_div.show();
                break;
            case "multi":
                second_size_div.show();

                matrix_size_input[1].eq(1).removeAttr('disabled');
                break;
            case "inverse":
                second_size_div.hide();

                matrix_size_input[0].eq(1).attr('disabled', 'disabled');
                break;
            case "transpose":
                second_size_div.hide();
                break;
       }
   });

    function draw_vector(size) {
        vector_show_divs.each(function (number) {
            $(this).empty();
            if (!VectorDiv.testInputVector(number)){
                let current_size = size;
                if (VectorDiv.testMultiVector(number)){
                    current_size = 2 * size + 1;
                    if (!isMatrixMulti()){
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                } else {
                    if (!isMatrixMulti()){
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
                for (let i = 0; i < current_size; i++){
                    let clone = make_clone($(this).data('template'));
                    clone.disabled = true;
                    $(this).append(clone);
                }
            }
        });
    }

    function getCalcType() {
        switch (title.data('translation')) {
            case "matrix_plus":
                return 0;
            case "matrix_minus":
                return 1;
            case "matrix_multi":
                return 2;
            case "matrix_inverse":
                return 3;
            case "matrix_transpose":
                return 4;
        }
    }

    function isMatrixMulti() {
        return getCalcType() === 2;
    }

    function draw_matrix(number, height, width) {
        let disabled = false;
        if (MatrixDiv.testOutputDiv(getCalcType(), number)){
            disabled = true;
        }
        matrix_show_divs.eq(number).empty();
        for (let i = 0; i < height; i++){
            let current_row = _get_row(matrix_show_divs.eq(number).data('template_row'));
            let element_template = matrix_show_divs.eq(number).data('template_element');
            for (let j = 0; j < width; j++){
                if (0 === j) {
                    current_row.appendChild(_get_element_input(element_template, disabled, -1));
                } else if (j === width - 1){
                    current_row.appendChild(_get_element_input(element_template, disabled, 1));
                } else {
                    current_row.appendChild(_get_element_input(element_template, disabled));
                }

            }
            matrix_show_divs.eq(number).append(current_row);
        }

        function _get_row(templateId) {
            return make_clone(templateId);
        }

        function _get_element_input(templateId, disabled, flag) {
            let clone = make_clone(templateId);
            clone.disabled = disabled;
            clone.style.borderTop = "none";
            clone.style.borderBottom = "none";
            if (-1 === flag){
                clone.style.borderRight = "none";
            } else if ( 1 === flag){
                clone.style.borderLeft = "none";
            } else {
                clone.style.borderLeft = "none";
                clone.style.borderRight = "none";
            }
            if (!disabled){
                clone.value = randomNum(-5, 5);
            }
            return clone;
        }
    }

    function updateMatrixByStep(step) {
        let currentVectors = [];

        for (let i = 0; i < inputMatrices.length; i++){
            inputMatrices[i].returnNormalColor();
        }
        outputMatrix.returnNormalColor();
        multiVector.returnNormalColor();

        switch (getCalcType()) {
            case 0:
            case 1:
                for (let i = 0; i < inputMatrices.length; i++){
                    currentVectors[i] = inputMatrices[i].getMatrix().cols[step];
                    inputMatrices[i].setColorCol(step);
                }

                outputMatrix.writeCol(step, currentVectors[0].calc(getCalcType(), currentVectors[1]));
                outputMatrix.setColorCol(step, 'red');

                calcVector.setDiv(currentVectors[0].calc_str(getCalcType(), currentVectors[1]));
                resultVector.setDiv(currentVectors[0].calc(getCalcType(), currentVectors[1]));
                break;
            case 2:
                let currentMultiRow = parseInt(step / inputMatrices[1].getMatrix().width);
                let currentMultiCol = step % inputMatrices[1].getMatrix().width;
                currentVectors[0] = inputMatrices[0].getMatrix().rows[currentMultiRow];
                inputMatrices[0].setColorRow(currentMultiRow);
                currentVectors[1] = inputMatrices[1].getMatrix().cols[currentMultiCol];
                inputMatrices[1].setColorCol(currentMultiCol);

                outputMatrix.writeValue(currentMultiRow, currentMultiCol, currentVectors[0].calc(getCalcType(), currentVectors[1]).getSum());
                outputMatrix.setColorValue(currentMultiRow, currentMultiCol);

                // calcVector.setDiv(currentVectors[0].calc_str(getCalcType(), currentVectors[1]));
                // resultVector.setDiv(currentVectors[0].calc(getCalcType(), currentVectors[1]));

                multiVector.setDiv(currentVectors[0].calc_str(getCalcType(), currentVectors[1]).getMultiVector());
                multiVector.writeValue(multiVector.getVector().size - 1, currentVectors[0].calc(getCalcType(), currentVectors[1]).getSum());
                multiVector.setColor(multiVector.getVector().size - 1);
                break;
            case 4:
                inputMatrices[0].setColorCol(step);
                currentVectors[0] = inputMatrices[0].getMatrix().getCol(step);
                outputMatrix.writeRow(step, currentVectors[0]);
                outputMatrix.setColorRow(step);
                break;
        }
    }
});