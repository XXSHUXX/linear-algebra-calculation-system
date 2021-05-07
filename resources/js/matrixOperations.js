$(document).ready(function(){
    let determinant_show_divs = $('.determinant-show-div'), title = $("#title"), step_control_button = $(".step-control-button");

    let currentStep = 0, maxStep = 2, matrix_height = 3, matrix_width = 3;
    let ifDoneStep = [], temp_determinant = [], temp_denominator = [], temp_color = [], temp_tips = [];
    let firstTimeCalc = true, STEP_PER_SIZE = 6,  STEP_LAST_SIZE = 2;

    let denominator = $("#denominator"), denominatorDiv = new DenominatorDiv(denominator);
    let inputDeterminant = new DeterminantDiv(determinant_show_divs.eq(0));

    let currentCol = 0, colStatus = 0, direction = 1;

    step_control_button.prop( "disabled", true);

    inputDeterminant.draw_determinant(matrix_height, matrix_width);
    denominator.width(3 * inputDeterminant.div.find('input').eq(0).width());

    $("#do_calc").on('click', function () {
        if (!firstTimeCalc){
            if (!confirm(messages['alert_calc'])){
                return false;
            }
        }
        firstTimeCalc = false;

        ifDoneStep = [];
        currentStep = 0;
        direction = 1;
        switch (getCalcType()) {
            case -1:
                STEP_PER_SIZE = 6;
                STEP_LAST_SIZE = 2;
                maxStep = STEP_PER_SIZE * (matrix_height - 1) + STEP_LAST_SIZE;
                break;
            case 0:
                currentCol = 0;
                colStatus = 0;
                STEP_PER_SIZE = 6;
                STEP_LAST_SIZE = 6;
                maxStep = STEP_PER_SIZE * (Math.min(matrix_width, matrix_height) - 1) + STEP_LAST_SIZE;
                break;
            case 1:
                currentCol = 0;
                colStatus = 0;
                STEP_PER_SIZE = 6;
                STEP_LAST_SIZE = 6;
                maxStep = STEP_PER_SIZE * (Math.min(matrix_width, matrix_height) - 1) + STEP_LAST_SIZE;
                maxStep *= 2;
                break;
        }
        for (let i = 0; i <= maxStep; i++){
            ifDoneStep[i] = false;
        }

        step_control_button.visible();
        denominatorDiv.clearAll();
        $("#do_back").prop("disabled", true);
        $("#do_next").prop("disabled", false);

        updateDeterminant(currentStep);
    });


    if (-1 === getCalcType()){
        $("#confirm_size").on('click', function () {
            step_control_button.invisible();
            denominatorDiv.clearAll();
            firstTimeCalc = true;
            step_control_button.prop( "disabled", true);
            matrix_height = get_size_number($("#determinant_size").val());
            // noinspection JSSuspiciousNameCombination
            inputDeterminant.draw_determinant(matrix_height, matrix_height);
        });
    }
    else {
        $('#confirm-calculation-type').on('click', function () {
            direction = 1;
            step_control_button.invisible();
            firstTimeCalc = true;
            step_control_button.prop( "disabled", true);
            let calculation_type = $("#calculation-type").val();
            set_data_attribute(title, 'translation', calculation_type);
            title.text(messages[calculation_type]);
            matrix_height = get_size_number($("#matrix-height").val());
            matrix_width = get_size_number($("#matrix-width").val());
            if (1 === getCalcType()) {
                matrix_width = get_size_number($("#matrix-width").val(), 4);
                set_data_attribute(determinant_show_divs.eq(0), "right", "gaussian-right");
            }
            if (0 === getCalcType()){
                set_data_attribute(determinant_show_divs.eq(0), "right", "determinant-right");
            }
            inputDeterminant.draw_determinant(matrix_height, matrix_width);
        });

    }

    step_control_button.on('click', function () {
        if ($(this).data('translation') === "next"){
            currentStep++;
        } else {
            currentStep--;
        }

        if (currentStep !== maxStep){
            $("#do_next").prop( "disabled", false);
        }
        if (0 !== currentStep){
            $("#do_back").prop( "disabled", false);
        }

        if (0 === currentStep || currentStep === maxStep - 1){
            $(this).prop( "disabled", true);
        }

        updateDeterminant(currentStep);
    });

    function updateDeterminant(step) {
        let currentDeterminant = inputDeterminant.getMatrix();

        switch (getCalcType()) {
            case -1:
                // noinspection JSCheckFunctionSignatures
                let currentStart = parseInt(step / STEP_PER_SIZE);
                inputDeterminant.resize(currentStart);
                denominator.width((matrix_height - currentStart) * inputDeterminant.div.find('input').eq(0).width());
                break;
            case 0:
            case 1:
                inputDeterminant.resize(0);
                break;
        }

        if (ifDoneStep[step]){
            denominatorDiv.load(temp_denominator[step]);
            inputDeterminant.setDiv(temp_determinant[step]);
            inputDeterminant.loadTips(temp_tips[step]);
            inputDeterminant.loadColor(temp_color[step]);
            return;
        }

        ifDoneStep[step] = true;
        inputDeterminant.clearTips();
        if (-1 === getCalcType()) {
            let status = step % STEP_PER_SIZE;
            let currentStart = parseInt(step / STEP_PER_SIZE);
            let firstVal = currentDeterminant.getValue(currentStart, currentStart);

            if (status === 0 && step !== 0){
                denominatorDiv.decreaseLastIndex();
            }
            if (currentStart === currentDeterminant.height - 1){
                switch (status) {
                    case 0:
                        inputDeterminant.setColorValue(currentStart, currentStart, "green");
                        break;
                    case 1:
                        let denominatorVal = denominatorDiv.getValue();
                        let minus_answer = false;
                        if (denominatorVal * firstVal < 0){
                            minus_answer = true;
                        }
                        denominatorVal = Math.abs(denominatorVal);
                        firstVal = Math.abs(firstVal);
                        let gcd = gcd_two_numbers(denominatorVal, firstVal);
                        inputDeterminant.writeValue(currentStart, currentStart, (minus_answer?"-":"") + parseInt(firstVal/gcd));
                        inputDeterminant.setColorTips(currentStart);
                        denominatorDiv.clearAll();
                        if (denominatorVal/gcd !== 1){
                            denominatorDiv.append(denominatorVal/gcd, "");
                            inputDeterminant.writeTips(currentStart, messages['answer'] + " " + (minus_answer?"-":"") + firstVal/gcd + "/" + denominatorVal/gcd);
                        } else {
                            inputDeterminant.writeTips(currentStart, messages['answer'] + " " + (minus_answer?"-":"") +  firstVal/gcd);
                        }
                        break;
                }
            } else {
                switch (status) {
                    case 0:
                        if (0 === firstVal){
                            if (checkALLZeroCol(currentStart, currentDeterminant)){
                                changeMaxStepNow(step);
                                denominatorDiv.clearAll();
                                inputDeterminant.setColorCol(currentStart, "red");
                                inputDeterminant.setColorTips(currentStart, "red");
                                inputDeterminant.writeTips(currentStart, messages['answer'] + " 0");
                            } else {
                                readyForExchanging(currentStart, currentDeterminant);
                            }
                        } else {
                            inputDeterminant.setColorRow(currentStart, "red");
                        }
                        break;
                    case 1:
                        if (0 === firstVal){
                            doExchange(currentStart, currentDeterminant);
                            denominatorDiv.append("-1", "1");
                        } else {
                            inputDeterminant.setColorRow(currentStart, "red");
                            inputDeterminant.writeTips(currentStart, firstVal + " ≠ 0");
                        }
                        break;
                    case 2:
                        readyForMulti(currentStart, currentDeterminant);
                        break;
                    case 3:
                        let denominatorVal = denominatorDiv.getValue();
                        denominatorDiv.clearAll();
                        if (denominatorVal !== 1){
                            denominatorDiv.append(denominatorVal, "");
                        }
                        denominatorDiv.append(firstVal, matrix_height - currentStart - 1);

                        doMulti(currentStart, currentDeterminant);
                        break;
                    case 4:
                        readyForMinus(currentStart, currentDeterminant, temp_determinant[step - status + 1]);
                        break;
                    case 5:
                        doMinus(currentStart, currentDeterminant, temp_determinant[step - status + 1]);
                        break;
                }
            }
        }
        if(0 === getCalcType() || (1 === getCalcType() && 1 === direction)) {
            let firstVal = currentDeterminant.getValue(currentCol, currentCol);
            switch (colStatus) {
                case 0:
                    if (0 === firstVal){
                        if (1 === getCalcType() && 1 === direction){
                            let rowAllZero = true;
                            for (let i = 0; i < currentDeterminant.width - 2; i++){
                                if (currentDeterminant.getValue(currentCol, i) !== 0){
                                    rowAllZero = false;
                                    break;
                                }
                            }
                            if (rowAllZero && currentDeterminant.getValue(currentCol, currentDeterminant.width - 2) !== 0){
                                inputDeterminant.writeTips(currentCol, "no solution");
                                inputDeterminant.setColorTips(currentCol, "red");
                                changeMaxStepNow(step);
                                alert("no solution");
                            } else {
                                if (checkALLZeroCol(currentCol, currentDeterminant)){
                                    inputDeterminant.setColorCol(currentCol, "red");
                                    colStatus = 0;
                                    currentCol++;
                                } else {
                                    readyForExchanging(currentCol, currentDeterminant, true);
                                    colStatus++;
                                }
                            }
                        } else {
                            if (checkALLZeroCol(currentCol, currentDeterminant)){
                                inputDeterminant.setColorCol(currentCol, "red");
                                colStatus = 0;
                                currentCol++;
                            } else {
                                readyForExchanging(currentCol, currentDeterminant, true);
                                colStatus++;
                            }
                        }
                    } else {
                        inputDeterminant.setColorRow(currentCol, "red");
                        colStatus++;
                    }
                    break;
                case 1:
                    if (0 === firstVal){
                        doExchange(currentCol, currentDeterminant, true);
                    } else {
                        inputDeterminant.setColorRow(currentCol, "red");
                        inputDeterminant.writeTips(currentCol, firstVal + " ≠ 0");
                    }
                    colStatus++;
                    break;
                case 2:
                    readyForMulti(currentCol, currentDeterminant);
                    colStatus++;
                    break;
                case 3:
                    doMulti(currentCol, currentDeterminant);
                    colStatus++;
                    break;
                case 4:
                    readyForMinus(currentCol, currentDeterminant, temp_determinant[step - colStatus + 1], true);
                    colStatus++;
                    break;
                case 5:
                    doMinus(currentCol, currentDeterminant, temp_determinant[step - colStatus + 1], true);
                    colStatus = 0;
                    currentCol++;
                    break;
            }
            if (0 === getCalcType()){
                if (currentCol === matrix_width || currentCol === matrix_height - 1){
                    changeMaxStepNow(step);
                }
            }
            if (1 === getCalcType() && 1 === direction){
                if (currentCol === matrix_width - 1){
                    let clear = true;
                    for (let i = currentCol; i < matrix_width; i++){
                        console.log("checked: col " + i + " start " + currentCol);
                        if (!checkALLZeroCol(currentCol, inputDeterminant.getMatrix(), inputDeterminant.getMatrix().height, i)){
                            clear = false;
                            break;
                        }
                    }
                    if (!clear){
                        inputDeterminant.writeTips(currentCol, "no solution");
                        inputDeterminant.setColorTips(currentCol, "red");
                        changeMaxStepNow(step);
                        alert("no solution");
                    } else {
                        currentCol--;
                        direction = -1;
                    }
                }
                else if (currentCol === matrix_height - 1){
                    direction = -1;
                }
            }
        }
        else if (1 === getCalcType() && -1 === direction){

            if (0 === currentCol){
                for (let i = 0; i < currentDeterminant.height; i++){
                    let currentGcd = 0;
                    for (let j = 0; j < currentDeterminant.width - 1; j++){
                        currentGcd = gcd_two_numbers(currentGcd, currentDeterminant.getValue(i, j));
                    }
                    for (let j = 0; j < currentDeterminant.width - 1; j++){
                        if (currentGcd !== 0){
                            inputDeterminant.writeValue(i, j, parseInt(currentDeterminant.getValue(i, j) / currentGcd));
                        }
                    }
                }
                changeMaxStepNow(step);
            }
            else {
                switch (colStatus) {
                    case 0:
                        if (currentDeterminant.getValue(currentCol, currentCol) === 0){
                            if (currentDeterminant.getValue(currentCol, currentDeterminant.width - 2) !== 0){
                                inputDeterminant.writeTips(currentCol, "no solution");
                                inputDeterminant.setColorTips(currentCol, "red");
                                changeMaxStepNow(step);
                                alert("no solution");
                            } else {
                                inputDeterminant.setColorRow(currentCol);
                                inputDeterminant.writeTips(currentCol, "0 row");
                                inputDeterminant.setColorTips(currentCol, "red");
                                currentCol--;
                            }
                        } else {
                            readyForMulti(currentCol, currentDeterminant, 0, currentCol);
                            colStatus++;
                        }
                        break;
                    case 1:
                        doMulti(currentCol, currentDeterminant, 0, currentCol);
                        colStatus++;
                        break;
                    case 2:
                        readyForMinus(currentCol, currentDeterminant, temp_determinant[step - colStatus], true, 0, currentCol);
                        colStatus++;
                        break;
                    case 3:
                        doMinus(currentCol, currentDeterminant, temp_determinant[step - colStatus], true, 0, currentCol);
                        colStatus = 0;
                        currentCol--;
                        break;
                }
            }
        }

        temp_determinant[step] = inputDeterminant.getMatrix();
        temp_tips[step] = inputDeterminant.saveTips();
        temp_color[step] = inputDeterminant.saveColor();
        temp_denominator[step] = denominatorDiv.save();
    }


    function getCalcType() {
        switch (title.data('translation')) {
            case "change_determinant_size":
                return -1;
            case "echelon_form":
                return 0;
            case "gaussian_elimination":
                return 1;
        }
    }

    function checkALLZeroCol(start, matrix, end = matrix.height, col = start) {
        for (let i = start; i < end; i++){
            if (matrix.getCol(col).elements[i] !== 0){
                return false;
            }
        }
        return true;
    }

    function readyForMinus(position, matrix, temp_matrix, absolutePosition, start = position + 1, end = matrix.height) {
        for (let i = start; i < end; i++){
            if (absolutePosition){
                inputDeterminant.writeTips(i, "- " + _minus_value(temp_matrix.getRow(i).elements[position]) + " * " + messages[position]);
            } else {
                inputDeterminant.writeTips(i, "- " + _minus_value(temp_matrix.getRow(i).elements[position]) + " * " + messages[0]);
            }
            inputDeterminant.setColorTips(i);
        }

    }

    function doMinus(position, matrix, temp_matrix, absolutePosition, start = position + 1, end = matrix.height) {
        for (let i = start; i < end; i++){
            inputDeterminant.writeRow(i, inputDeterminant.getMatrix().getRow(i).calc(1,
                inputDeterminant.getMatrix().getRow(position).multiNumber(temp_matrix.getRow(i).elements[position])
            ));
            if (absolutePosition){
                inputDeterminant.writeTips(i, "- " + _minus_value(temp_matrix.getRow(i).elements[position]) + " * " + messages[position]);
            } else {
                inputDeterminant.writeTips(i, "- " + _minus_value(temp_matrix.getRow(i).elements[position]) + " * " + messages[0]);
            }
            inputDeterminant.setColorRow(i);
        }
    }

    function readyForMulti(position, matrix, start = position + 1, end = matrix.height) {
        inputDeterminant.setColorValue(position, position, "green");
        for (let i = start; i < end; i++){
            inputDeterminant.setColorTips(i);
            inputDeterminant.writeTips(i, "* " + _minus_value(matrix.getValue(position, position)));
        }
    }

    function doMulti(position, matrix, start = position + 1, end = matrix.height) {
        for (let i = start; i < end; i++){
            inputDeterminant.writeRow(i, matrix.getRow(i).multiNumber(matrix.getValue(position, position)));
            inputDeterminant.writeTips(i, "* " + _minus_value(matrix.getValue(position, position)));
            inputDeterminant.setColorRow(i);
        }
    }

    function readyForExchanging(start, matrix, absolutePosition, end = matrix.height) {
        for (let i = start + 1; i < end; i++){
            if (matrix.getCol(start).elements[i] !== 0){
                inputDeterminant.setColorRow(start);
                inputDeterminant.setColorRow(i, "red");
                if (absolutePosition){
                    inputDeterminant.writeTips(start, messages[start] + '↔' + messages[i]);
                    inputDeterminant.writeTips(i, messages[start] + '↔' + messages[i]);
                } else {
                    inputDeterminant.writeTips(start, messages[0] + '↔' + messages[i - start]);
                    inputDeterminant.writeTips(i, messages[0] + '↔' + messages[i - start]);
                }
                break;
            }
        }
    }

    function doExchange(start, matrix, absolutePosition, end = matrix.height) {
        for (let i = start + 1; i < end; i++){
            if (matrix.getCol(start).elements[i] !== 0){
                inputDeterminant.writeRow(start, matrix.getRow(i));
                inputDeterminant.writeRow(i, matrix.getRow(start));
                inputDeterminant.setColorRow(start, "red");
                inputDeterminant.setColorRow(i);
                if (absolutePosition){
                    inputDeterminant.writeTips(start, messages[start] + '↔' + messages[i] + " " + matrix.getCol(start).elements[i] + " ≠ 0");
                    inputDeterminant.writeTips(i, messages[start] + '↔' + messages[i]);
                }
                else {
                    inputDeterminant.writeTips(start, messages[0] + '↔' + messages[i - start] + " " + matrix.getCol(start).elements[i] + " ≠ 0");
                    inputDeterminant.writeTips(i, messages[0] + '↔' + messages[i - start]);
                }
                break;
            }
        }
    }

    function changeMaxStepNow(step) {
        maxStep = step + 1;
        $("#do_next").prop( "disabled", true);
    }
});
