export class Todo {
  static #list = []
  static #count = 0
  static #NAME = 'todo'

  static #safeData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  static #block = null
  static #template = null
  static #input = null
  static #button = null
  static #taskQuantity = null
  static #doneQuantity = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.task-list')

    this.#input = document.querySelector('.form__input')

    this.#button = document.querySelector('.form__button')

    this.#taskQuantity =
      document.querySelector('.info__tasks')

    this.#doneQuantity =
      document.querySelector('.info__done')

    this.#button.onclick = this.#handleAdd

    this.#loadData()

    this.#render()
  }

  static #handleAdd = () => {
    const value = this.#input.value

    if (value.length > 1) {
      this.#createTaskData(value)

      this.#input.value = ''

      this.#render()

      this.#safeData()
    }
  }

  static #render = () => {
    this.#block.innerHTML = ''

    const done = this.#list.filter(
      (task) => task.done !== false,
    )

    this.#taskQuantity.innerHTML = `Кількість задач: ${
      this.#list.length
    }`
    this.#doneQuantity.innerHTML = `Виконано: ${done.length}`

    if (this.#list.length === 0) {
      this.#block.innerText = 'Список задач пустий'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)

        this.#block.append(el)
      })
    }
  }

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true)

    const [id, text, btnDo, btnCancel] = el.children

    id.innerText = `${data.id}.`

    text.innerText = data.text

    btnCancel.onclick = this.#handleCancel(data)

    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      el.classList.add('task--done')
      btnDo.classList.remove('task__button--do')
      btnDo.classList.add('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    if (result === true || result === false) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      this.#safeData()
    }
    this.#render()
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((task) => task.id === id)

    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }

  static #handleCancel = (data) => () => {
    if (confirm('Видалити задачу?')) {
      const result = this.#deleteById(data.id)
      if (result) {
        this.#safeData()
        this.#render()
      }
    }
  }

  static #deleteById = (id) => {
    this.#list = this.#list.filter((task) => task.id !== id)
    return true
  }
}

Todo.init()

window.todo = Todo
