// Constructor function(Đối tượng validator)
function Validator(option) {

    var selectorRules = {}

    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement =
            inputElement.parentElement.querySelector(option.errorSelector)

        var errorMessage
        
        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // lặp qua từng rule và kiểm tra (Nếu có lỗi thì dừng việc kiểm tra)
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break 
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add("invalid")
        } else {
            errorElement.innerText = ""
            inputElement.parentElement.classList.remove("invalid")
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

            var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')

            var formValue = Array.from(enableInputs).reduce((values, input) => {
                return (values[input.name] = input.value) && values
            }, {})
            // console.log(formValue);

            if (isFormValid) {
                // trường hợp submit với javascript
                if (typeof option.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValue = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values
                    }, {})
                    option.onSubmit(formValue)
                } else {
                    // trường hợp submit với hành vi mặc định
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

            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {
                // xử lý trường hợp blur ra input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };
                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement =
                        inputElement.parentElement.querySelector(".form-message");
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove("invalid");
                }
            }
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
            return value.trim() ? undefined : message || "Vui lòng nhập trường này"
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