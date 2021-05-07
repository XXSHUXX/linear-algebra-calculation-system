let messages = TRANSLATION_DATA["en"];
function changeLanguage(language){
    language = language.substr(0, 2);
    if (language !== "zh" && language !=="en" && language !== "ja"){
        language = "en";
    }
    messages = TRANSLATION_DATA[language];
    setTranslations();
}

function setTranslations(){
    $('[data-translation != ""]').each(function () {
        $(this).text(messages[$(this).data('translation')]);
    });
}

function get_size_number(size, defaultValue = 3){
    if (size.length === 0 || isNaN(size)){
        size = defaultValue;
    }
    size = parseInt(size);
    if (size === 0){
        size = defaultValue;
    }
    return size;
}

function get_value_number(value){
    if (value.length === 0 || isNaN(value)){
        return 0;
    } else {
        return parseInt(value);
    }
}

function make_clone(template_id){
    let clone = document.createElement('input');
    switch (template_id) {
        case "element-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.maxLength = 3;
            clone.style.backgroundColor = "white";
            break;
        case "vector-element-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.classList.add('vector-element-input');
            clone.maxLength = 3;
            break;
        case "vector-result-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.classList.add('vector-element-input');
            clone.style.color = "red";
            clone.style.backgroundColor = "white";
            break;
        case "multi-result-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.style.width = "90px";
            clone.style.color = "red";
            clone.style.backgroundColor = "white";
            break;
        case "vector-calculation-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.classList.add('vector-element-input');
            clone.style.color = "blue";
            clone.style.backgroundColor = "white";
            break;
        case "multi-calculation-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.style.color = "blue";
            clone.style.backgroundColor = "white";
            break;
        case "matrix-element-template":
            clone = document.createElement('input');
            clone.classList.add('form-control');
            clone.classList.add('element-input');
            clone.classList.add('matrix-element-input');
            clone.maxLength = 3;
            clone.style.backgroundColor = "white";
            break;
        case "determinant-element-template":
            clone = document.createElement('input');
            clone.classList.add('element-input');
            clone.classList.add('matrix-element-input');
            clone.maxLength = 3;
            // clone.style.backgroundColor = "white";
            break;
        case "matrix-tips-template":
            clone = document.createElement('input');
            clone.classList.add('element-input');
            clone.classList.add('determinant-calc');
            clone.classList.add('form-control');
            clone.classList.add('matrix-element-input');
            break;
        case "determinant-calc-template":
            clone = document.createElement('input');
            clone.classList.add('element-input');
            clone.maxLength = 3;
            break;
        case "matrix-row-template":
            clone = document.createElement('div');
            clone.classList.add('input-group');
            break;
        case "determinant-row-template":
            clone = document.createElement('div');
            clone.classList.add('input-group');
            break;
    }
    return clone;
}

function set_data_attribute(element, data_name, data){
    element.data(data_name, data);
    element.attr('data-' + data_name, data);
}

function randomNum(minNum,maxNum){
    return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
}

function gcd_two_numbers(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

$(document).ready(function(){
    changeLanguage(navigator.language);
    $('.language-selector').on('click', function () {
        changeLanguage($(this).data('language'));
    });

    $(document).on('change', '.element-input, .size-input', function () {
        if (isNaN($(this).val())){
            alert(messages["alert_number"]);
            $(this).val('');
        }
    })
});

function _minus_value(value) {
    if (value < 0){
        return "(" + value + ")";
    }
    return value;
}

(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));