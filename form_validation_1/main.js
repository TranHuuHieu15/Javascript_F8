// Constructor function(Đối tượng validator)
function Validator(option) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}

    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorSelector)

        var errorMessage

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // lặp qua từng rule và kiểm tra (Nếu có lỗi thì dừng việc kiểm tra)
        for (var i = 0; i < rules.length; ++i) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    ) 
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, option.formGroupSelector).classList.add("invalid")
        } else {
            errorElement.innerText = ""
            getParent(inputElement, option.formGroupSelector).classList.remove("invalid")
        }

        return !errorMessage
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(option.form);
    if (formElement) {

        // bỏ đi hành vi mặc định của form
        formElement.onsubmit = function (e) {
            e.preventDefault()

            var isFormValid = true

            option.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false
                }
            })

            if (isFormValid) {
                if (typeof option.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValue = Array.from(enableInputs).reduce((values, input) => {
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value                                
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = ""
                                    return values
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }
                        
                        return values
                    }, {})
                    option.onSubmit(formValue)
                } else {
                    formElement.submit()
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (Lắng nghe sự kiện blur, input)
        option.rules.forEach((rule) => {

            //Lưu lại các rule cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelectorAll(rule.selector)

            Array.from(inputElement).forEach((inputElement) => {
                // xử lý trường hợp blur ra input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };
                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement =
                        getParent(inputElement, option.formGroupSelector).querySelector(".form-message");
                    errorElement.innerText = "";
                    getParent(inputElement, option.formGroupSelector).classList.remove("invalid");
                }

                inputElement.onchange = function () {
                    var errorElement =
                        getParent(inputElement, option.formGroupSelector).querySelector(".form-message");
                    errorElement.innerText = "";
                    getParent(inputElement, option.formGroupSelector).classList.remove("invalid");
                }
            })
        })
    }
}
//Định nghĩa các rules
//Đặt ra nguyên tắt của các rule
//1. Khi có lỗi => trả ra message lỗi
//2. khi không có lỗi => trả ra cái gì cả
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value? undefined : message || "Vui lòng nhập trường này"
        },
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        },
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`
        },
    }
}

Validator.isConfirmed = function (selector, getConfirmedValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmedValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}