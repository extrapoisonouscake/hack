(function() {
    alert("ДИСКЛЕЙМЕР\nСКРИПТ СОЗДАН В ОБРАЗОВАТЕЛЬНЫХ ЦЕЛЯХ И НЕ ПРИЗЫВАЕТ КОГО-ЛИБО К СОВЕРШЕНИЮ ЧЕГО-ЛИБО. ЛЮБОЙ, ИСПОЛЬЗУЮЩИЙ ЕГО, ДЕЛАЕТ ВСЕ НА СВОЙ СТРАХ И РИСК.");
    alert(`ВАЖНО\nДобро пожаловать в решалку тестов Полякова по информатике. После заполнения необходимой информации все ответы, которые можно получить, автоматически подставятся вам, для остальных же придется решить самому, ЛИБО ПРОСТО НАЖАТЬ НА КНОПКУ "Проверить ответы" и АВТОМАТИЧЕСКИ ВЫСВЕТИТСЯ ОКНО, ЧТО У ВАС РЕШЕНЫ ВСЕ ЗАДАНИЯ, даже если это не так ❤️.`);
    const userBruteCount = prompt("Введите максимум попыток взлома для каждого вопроса с числами. Если поле пустое или не является числом, то будет сделано 30 попыток для каждого .");
    const areNotAll = confirm("Нужно ли вам выбрать, какие задачи решать, четные или нечетные?");
    let onlyEven;
    if (areNotAll) {
        onlyEven = confirm("Если нужно решить только четные задания, нажмите ОК, иначе ОТМЕНА.")
    }
    const marks = [2, 3, 4, 5];
    let errorsCount = 0;
    const MAX_BRUTEFORCE_COUNT = Number.isInteger(userBruteCount) ? userBruteCount : 30;
    let questionTypes = document.querySelector('input[name="code"]').value.split("");
    const totalLength = questionTypes.length;
    let elements = [...document.querySelectorAll(".q")];
    if (areNotAll) {
        elements = elements.filter((element, index) => (index + 1) % 2 == Number(!onlyEven));
        questionTypes = questionTypes.filter((element, index) => (index + 1) % 2 == Number(!onlyEven))
    }
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        try {
            const questionId = element.getAttribute("id").substring(1);
            const inputs = [...element.querySelectorAll("input")];
            if (inputs.some(elem => elem.getAttribute("type") === "checkbox")) {
                for (const checkbox of inputs.filter(input => input.getAttribute("type") === "checkbox")) {
                    if (checkbox.value === "1") {
                        checkbox.checked = true
                    }
                }
            } else if (inputs.some(elem => elem.getAttribute("type") === "radio")) {
                const correctRadio = inputs.find(input => input.value === "1");
                correctRadio.checked = true
            } else {
                const targetInput = inputs.find(input => input.getAttribute("type") === "text");
                targetInput.classList.remove("default");
                if (["s", "m"].includes(questionTypes[i])) {
                    targetInput.value = "Решить не получилось";
                    element.classList.add("noans");
                    errorsCount += 1;
                    continue
                }
                const dumbHash = element.querySelector(`[name="a${questionId}_"]`).value;
                let answer;
                for (let i = 0; i < MAX_BRUTEFORCE_COUNT; i++) {
                    if (!checkHash(dumbHash, String(i))) {
                        continue
                    }
                    answer = i;
                    break
                }
                if (!answer) {
                    targetInput.value = Math.floor(Math.random() * 15);
                    continue
                }
                targetInput.value = answer
            }
        } catch {
            element.classList.add("noans");
            errorsCount += 1
        }
    }
    if (errorsCount) {
        alert(`К сожалению, мой офигенный скрипт не смог обработать ${errorsCount} заданий, НО ОБРАБОТАЛ ОСТАЛЬНЫЕ. Дорешай сам, короче (они отмечены красной рамкой).`)
    }
    const cover = document.getElementById("cover");
    cover.style.left = 0;
    cover.style.top = 0;
    const msgContainer = document.getElementById("msg");
    const popup = document.getElementById("popup");
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%,-50%)";
    cover.onclick = () => {
        popup.style.visibility = "hidden";
        cover.style.visibility = "hidden";
        document.body.style.overflow = "auto"
    };
    window.showFakeModal = () => {
        try {
            for (const element of elements) {
                element.classList.remove("noans");
                element.classList.remove("errans")
            }
            document.body.style.overflow = "hidden";
            cover.style.visibility = "visible";
            const score = Math.round(elements.length / (totalLength / 100));
            const mark = marks.reduce(function(prev, curr) {
                return Math.abs(curr - score / (10 * 2)) < Math.abs(prev - score / (10 * 2)) ? curr : prev
            });
            msgContainer.innerHTML = `Вы правильно ответили на ${elements.length} вопрос из ${totalLength}.<br/>
Результат: ${score} баллов из 100.<br>
Отметка: ${mark}.<br/>`;
            popup.style.visibility = "visible";
            window.scrollTo(0, 0)
        } catch {}
    };
    document.getElementById("submit-btn").outerHTML = '<input id="submit-btn" type="button" value="Проверить ответы" name="submit" onclick="return showFakeModal();">'
})();
