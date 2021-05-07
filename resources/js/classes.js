class Vector {
    constructor(elements) {
        this.size = elements.length;
        this.elements = elements;
    }
    calc(operator, other){
        if (other.size !== this.size){
            return -1;
        }
        let ret = [];
        for (let i = 0; i < this.size; i++){
            switch (operator) {
                case 0:
                    ret[i] = this.elements[i] + other.elements[i];
                    break;
                case 1:
                    ret[i] = this.elements[i] - other.elements[i];
                    break;
                case 2:
                    ret[i] = this.elements[i] * other.elements[i];
                    break;
            }
        }
        return new Vector(ret);
    }

    calc_str(operator, other){
        if (other.size !== this.size){
            return -1;
        }
        let ret = [];
        let temp_elements = [];
        for (let i = 0; i < this.size; i++){
            if (other.elements[i] < 0){
                temp_elements[i] = "(" + other.elements[i] + ")";
            } else {
                temp_elements[i] = other.elements[i];
            }
        }
        for (let i = 0; i < this.size; i++){
            switch (operator) {
                case 0:
                    ret[i] = this.elements[i] + " + " + temp_elements[i];
                    break;
                case 1:
                    ret[i] = this.elements[i] + " - " + temp_elements[i];
                    break;
                case 2:
                    ret[i] = this.elements[i] + " * " + temp_elements[i];
                    break;
            }
        }
        return new Vector(ret);

    }

    getSum(){
        let ret = 0;
        for (let i = 0; i < this.size; i++){
            ret += this.elements[i];
        }
        return ret;
    }

    getMultiVector(){
        let ret = [];
        for (let i = 0; i < this.size; i++){
            ret[2 * i] =  this.elements[i];
            if (i !== this.size - 1){
                ret[2 * i + 1] = '+';
            } else {
                ret[2 * i + 1] = '=';
            }
        }
        return new Vector(ret);
    }

    multiNumber(number){
        let ret = [];
        for (let i = 0; i < this.size; i++){
            ret[i] = this.elements[i] * number;
        }
        return new Vector(ret);
    }
}

class Matrix{
    constructor(elements) {
        this.height = elements.length;
        this.width = elements[0].length;
        this.elements = elements;
        this.rows = [];
        for (let i = 0; i < this.height; i++){
            this.rows[i] = new Vector(elements[i]);
        }
        this.cols = [];
        for (let j = 0; j < this.width; j++){
            let currentCol = [];
            for (let i = 0; i < this.height; i++){
                currentCol[i] = elements[i][j];
            }
            this.cols[j] = new Vector(currentCol);
        }
    }

    getRow(number){
        return this.rows[number];
    }

    getCol(number){
        return this.cols[number];
    }

    getValue(x, y){
        return this.rows[x].elements[y];
    }

    setRow(number, newRowVector){
        this.rows[number] = newRowVector;
    }

    setCol(number, newColVector){
        this.cols[number] = newColVector;
    }
}

class Div{
    constructor(div, number) {
        this.div = div;
        this.number = number;
    }
}

class VectorDiv extends Div{
    constructor(div, number) {
        super(div, number);
        this.isInputVector = VectorDiv.testInputVector(this.number);
        this.isCalcVector = VectorDiv.testCalcVector(this.number);
        this.isResultVector = VectorDiv.testResultVector(this.number);
        this.isMultiVector = VectorDiv.testMultiVector(this.number);
    }

    getVector(){
        let temp_elements = [];
        this.div.find('input').each(function (i) {
            temp_elements[i] = $(this).val();
        });
        return new Vector(temp_elements);
    }

    returnNormalColor(){
        this.div.find('input').each(function () {
            $(this).css('color', 'black');
            $(this).css('background-color', 'white');
        });
    }

    setColor(number, color){
        this.div.find('input').each(function (i) {
            if (number === i){
                $(this).css('color', 'white');
                $(this).css('background-color', color?color:'green');
            }
        });
    }

    setDiv(vector){
        this.div.find('input').each(function (i) {
            $(this).val(vector.elements[i]);
        });
    }

    clear(){
        this.div.find('input').each(function () {
            $(this).val('');
        });
    }

    writeValue(number, value){
        this.div.find('input').each(function (i) {
            if (i === number){
                $(this).val(value);
            }
        });
    }


    static testInputVector(number){
        return 0 === number || 1 === number;
    }
    static testCalcVector(number){
        return 2 === number;
    }
    static testResultVector(number){
        return 3 === number;
    }
    static testMultiVector(number){
        return 4 === number;
    }
}

class MatrixDiv extends Div{
    constructor(div, number, calc_type) {
        super(div, number);
        this.calc_type = calc_type;
        this.isInputDiv = MatrixDiv.testInputDiv(this.calc_type, this.number);
        this.isOutputDiv = MatrixDiv.testOutputDiv(this.calc_type, this.number);
        this.returnNormalColor();
    }

    getMatrix() {
        let temp_elements = [];
        this.div.find('div').each(function (i) {
            temp_elements[i] = [];
            $(this).find('input').each(function (j) {
                temp_elements[i][j] = get_value_number($(this).val());
            });
        });
        return new Matrix(temp_elements);
    }

    clear(){
        this.div.find('div').each(function () {
            $(this).find('input').each(function () {
                $(this).val('');
            });
        });
    }

    returnNormalColor(){
        this.div.find('div').each(function () {
            $(this).find('input').each(function () {
                $(this).css('background-color', 'white');
                $(this).css('color', 'black');
            });
        });
    }

    setColorRow(number, color, fontColor){
        this.div.find('div').each(function (i) {
            if (i === number){
                $(this).find('input').each(function () {
                    $(this).css('background-color', color ? color : 'blue');
                    $(this).css('color', fontColor? fontColor : 'white');
                });
            }
        });
    }

    setColorCol(number, color, fontColor){
        this.div.find('div').each(function () {
            $(this).find('input').each(function (j) {
                if (j === number){
                    $(this).css('background-color', color ? color : 'blue');
                    $(this).css('color', fontColor ? fontColor : 'white');
                }
            });
        });
    }

    setColorValue(row, col, color, fontColor){
        this.div.find('div').each(function (i) {
            if (i === row){
                $(this).find('input').each(function (j) {
                    if (j === col){
                        $(this).css('background-color', color ? color : 'green');
                        $(this).css('color', fontColor ? fontColor : 'white');
                    }
                });
            }
        });
    }

    writeValue(row, col, value){
        this.div.find('div').each(function (i) {
            if (i === row){
                $(this).find('input').each(function (j) {
                    if (j === col){
                        $(this).val(value);
                    }
                });
            }
        });
    }

    writeRow(number, rowVector){
        this.div.find('div').each(function (i) {
            if (i === number){
                $(this).find('input').each(function (j) {
                    $(this).val(rowVector.elements[j]);
                });
            }
        });
    }

    writeCol(number, colVector){
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                if (j === number){
                    $(this).val(colVector.elements[i]);
                }
            });
        });
    }

    setDiv(matrix){
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                $(this).val(matrix.elements[i][j]);
            });
        });
    }

    static testInputDiv(calc_type, number){
        switch (calc_type) {
            case 0:
            case 1:
            case 2:
                return (number < 2);
            case 3:
            case 4:
                return (number < 1);
        }
    }
    static testOutputDiv(calc_type, number){
        switch (calc_type) {
            case 0:
            case 1:
            case 2:
                return (number === 2);
            case 3:
            case 4:
                return (number === 1);
        }
    }
}

class DeterminantDiv extends MatrixDiv {
    constructor(div, number) {
        super(div, number);
        this.start = 0;
    }

    resize(start){
        this.start = start;
        let width = this.getMatrix().width;
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                $(this).removeClass('determinant-left');
                $(this).removeClass('determinant-right');
                $(this).removeClass('determinant-center');
                $(this).removeClass('determinant-calc');
                if (i < start || j < start){
                    // $(this).css('color', 'white');
                    // $(this).css('backgroundColor', 'white');
                    // $(this).attr('disabled', 'disabled');
                    $(this).attr('hidden', 'hidden');

                    $(this).addClass('determinant-center');
                } else {
                    $(this).css('color', 'black');
                    $(this).css('backgroundColor', 'white');
                    // $(this).removeAttr('disabled');
                    $(this).removeAttr('hidden');

                    if (start === width - 2){
                        if (j === width - 2) {
                            $(this).addClass('determinant-center');
                        } else if (j === width - 1) {
                            $(this).addClass('determinant-calc');
                        }
                    } else {
                        if (j === start) {
                            $(this).addClass('determinant-left');
                        } else if (j === width - 2) {
                            $(this).addClass('determinant-right');
                        } else if (j === width - 1) {
                            $(this).addClass('determinant-calc');
                        } else {
                            $(this).addClass('determinant-center');
                        }
                    }
                }
            });
        });
    }

    writeTips(number, tips){
        let width = this.getMatrix().width;
        this.div.find('div').each(function (i) {
            if (i === number){
                $(this).find('input').each(function (j) {
                    if (j === width - 1){
                        $(this).val(tips);
                    }
                });
            }
        });
    }

    setColorTips(number, color, fontColor){
        let width = this.getMatrix().width;
        this.div.find('div').each(function (i) {
            if (i === number){
                $(this).find('input').each(function (j) {
                    if (j === width - 1){
                        $(this).css('background-color', color ? color : "green");
                        $(this).css('color', fontColor ? fontColor : "white");
                    }
                });
            }
        });
    }

    clearTips(){
        let height = this.getMatrix().height;
        for (let i = 0; i < height; i++){
            this.writeTips(i, "");
        }
    }

    saveColor(){
        let ret = [];
        this.div.find('div').each(function (i) {
            ret[i] = [];
            $(this).find('input').each(function (j) {
                ret[i][j] = [];
                ret[i][j][0] = $(this).css('color');
                ret[i][j][1] = $(this).css('backgroundColor');
            });
        });
        return ret;
    }

    loadColor(colorMatrix){
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                $(this).css('color', colorMatrix[i][j][0]);
                $(this).css('backgroundColor', colorMatrix[i][j][1]);
            });
        });
    }

    saveTips(){
        let ret = [];
        let width = this.getMatrix().width;
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                if (j === width - 1){
                    ret[i] = $(this).val();
                }
            })
        });
        return ret;
    }

    loadTips(tips){
        let width = this.getMatrix().width;
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                if (j === width - 1){
                    $(this).val(tips[i]);
                }
            })
        });
    }


    setColorRow(number, color, fontColor){
        let start = this.start;
        this.div.find('div').each(function (i) {
            if (i === number){
                $(this).find('input').each(function (j) {
                    if (i >= start && j >= start){
                        $(this).css('background-color', color ? color : 'blue');
                        $(this).css('color', fontColor? fontColor : 'white');
                    }
                });
            }
        });
    }

    setColorCol(number, color, fontColor){
        let start = this.start;
        this.div.find('div').each(function (i) {
            $(this).find('input').each(function (j) {
                if (j === number){
                    if (i >= start && j >= start){
                        $(this).css('background-color', color ? color : 'blue');
                        $(this).css('color', fontColor ? fontColor : 'white');
                    }
                }
            });
        });
    }

    draw_determinant(height, width) {
        this.div.empty();
        for (let i = 0; i < height; i++){
            let current_row = _get_row(this.div.data('template_row'));
            let element_template = this.div.data('template_element');
            for (let j = 0; j < width; j++){
                let clone = _get_element_input(element_template);
                if (i === j){
                    while(0 == clone.value){
                        clone.value = randomNum(-5, 5);
                    }
                }
                if (height === 1){
                    if (0 === j) {
                        clone.classList.add(this.div.data('center'));
                    }
                } else {
                    if (0 === j) {
                        clone.classList.add(this.div.data('left'));
                    } else if (j === width - 1){
                        clone.classList.add(this.div.data('right'));
                        if (this.div.data('mr')){
                            clone.classList.add("mr-1");
                        }
                    } else {
                        clone.classList.add(this.div.data('center'));
                    }
                }
                current_row.appendChild(clone);
            }
            let calc_zone = _get_element_input(this.div.data('template_calc'), true);
            calc_zone.value="";
            calc_zone.classList.add(this.div.data('calc'));
            current_row.appendChild(calc_zone);
            this.div.append(current_row);
        }

        function _get_row(templateId) {
            return make_clone(templateId);
        }

        function _get_element_input(templateId, disabled) {
            let clone = make_clone(templateId);
            clone.disabled = disabled;
            if (!disabled){
                clone.value = randomNum(-5, 5);
            }
            return clone;
        }
    }
}

class DenominatorDiv extends Div{
    constructor(div) {
        super(div);
        this.count = 0;
        this.div.find('math').eq(0).find('msup').attr('hidden', 'hidden');
        this.div.find("hr, span").attr('hidden', 'hidden');
        this.haveTipsDiv = false;
        if (this.div.data('tips_div')){
            this.haveTipsDiv = true;
            this.tipsDiv = new DenominatorDiv($("#" + this.div.data('tips_div')));
        }
    }

    append(a, b){
        if (this.haveTipsDiv){
            this.tipsDiv.append(a, b);
        }
        if (this.div.find("hr, span").attr('hidden')){
            this.div.find("hr, span").removeAttr('hidden');
        }
        let count = this.count;
        this.div.find('math').eq(0).find('msup').each(function (i) {
            if (i === count){
                $(this).removeAttr('hidden');
                $(this).find('mi').eq(0).text(a);
                $(this).find('mn').eq(0).text(b);
            }
        });
        this.count++;
    }

    clearAll(){
        if (this.haveTipsDiv){
            this.tipsDiv.clearAll();
        }
        this.count = 0;
        this.div.find("hr, span").attr('hidden', 'hidden');
        this.div.find('math').eq(0).find('msup').each(function () {
            $(this).attr('hidden', 'hidden');
            $(this).find('mi').eq(0).text("");
            $(this).find('mn').eq(0).text("");
        });

    }

    getValue(){
        let count = this.count;
        let ret = 1;
        this.div.find('math').eq(0).find('msup').each(function (i) {
            if (i < count){
                let a = $(this).find('mi').eq(0).text();
                let b = $(this).find('mn').eq(0).text();
                if (b === ""){
                    ret *= a;
                } else {
                    ret *= a**b;
                }
            }
        });
        return ret;
    }

    save(){
        let ret = [];
        let count = this.count;
        this.div.find('math').eq(0).find('msup').each(function (i) {
            if (i < count){
                ret[i] = [];
                ret[i][0] = $(this).find('mi').eq(0).text();
                ret[i][1] = $(this).find('mn').eq(0).text();
            }
        });
        return ret;
    }

    load(elements){
        if (this.haveTipsDiv){
            this.tipsDiv.load(elements);
        }
        this.clearAll();
        for (let i = 0; i < elements.length; i++){
            this.append(elements[i][0], elements[i][1]);
        }
    }

    decreaseLastIndex(){
        if (this.haveTipsDiv){
            this.tipsDiv.decreaseLastIndex();
        }
        let selfCount = this.count;
        let selfDiv = this.div;
        this.div.find('math').eq(0).find('msup').each(function (i) {
            if (i === selfCount - 1){
                let currentIndex = $(this).find('mn').eq(0).text() - 1;
                if (currentIndex === 0){
                    $(this).attr('hidden', 'hidden');
                    $(this).find('mi').eq(0).text("");
                    $(this).find('mn').eq(0).text("");
                    selfCount--;
                    if (selfCount === 0){
                        selfDiv.find("hr, span").attr('hidden', 'hidden');
                    }
                } else {
                    $(this).find('mn').eq(0).text($(this).find('mn').eq(0).text() - 1);
                }
            }
        });
        this.count = selfCount;
    }
}