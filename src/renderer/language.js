export default {
	ua: {
		apiErrors: {
			validation: "Помилка валідації",
			basic: "Помилка",
			auth: "Помилка авторизації",
			restricted: "Помилка: заборонено",
			method: "Помилка: невірний метод",
			server: "Помилка серверу",
			unknown: "Невідома помилка",
			notFound: "Не знайдено",
			console: "Подробиці в консолі",
			tryLater: "Забагато запитів. Спробуйте пізніше"
		},
		error: "Помилка",
		success: "Успішно",
		register: "Ви зареєстровані в системі. На вашу електронну пошту було надіслано лист для підтвердження. Щоб почати користуватись сервісом використовуйте отриманий ключ та пароль.<br><br>Не передавайте ключ стороннім особам та не повідомляйте ваш пароль, інакше ваші дані опиняться в небезпеці.",
		language: "Мова",
		noConnection: "Відсутнє з'єднання з сервером",
		profile: {
			mailUnverified: "Ваша електронна пошта не підтверджена, для завантаження даних вам необхідно підтвердити її",
			verify: "Підтвердити",
			verified: "Ваша електронна пошта підтверджена",
			myData: "Мої дані",
			name: "Ім'я",
			type: "Тип",
			size: "Розмір",
			date: "Дата завантаження",
			noData: "Даних не знайдено",
			sizes: [
				'Байт',
				'кБ',
				'МБ',
				'ГБ',
				'ТБ'
			],
			nullSize: "0 Байт",
			dateFormat: "uk",
			searchByName: "Пошук за ім'ям",

			addData: "Додати дані",
			addPlain: "Додати текст",
			addFile: "Додати файл",
			addPlainData: "Додати текстові дані",
			insertName: "введіть ім'я",
			charLimit: "не більше 255 символів",
			plainData: "Текст",
			insertPlainData: "введіть текст",
			plainDataLimit: limit => {
				return "не більше " + limit + " символів";
			},
			cancel: "Відмінити",
			save: "Зберегти",
			file: "Файл",
			chooseFile: "оберіть файл",
			tooLargeFile: limit => {
				return "Файл занадто великий, максимальний розмір: " + limit;
			},
			notSupported: "Файл не підтримується",

			actionsMenu: "Меню дій",
			changeName: "Змінити ім'я",
			download: "Завантажити",
			remove: "Видалити",
			confirmation: "Підтвердження",
			areYouSure: "Ви впевнені що хочете видалити обрані дані?",
			yes: "Так",
			no: "Ні",
			enterNewName: "Введіть нове ім'я",
			newName: "Нове ім'я",
			received: 'Файл успішно розшифровано, завантажено та збережено',

			emailConfirmation: "Підтвердження пошти",
			emailConfirmationTexts: [
				'На вашу пошту було надіслано код підтвердження, введіть його в поле нижче.',
				'Якщо код вам не надійшов натисніть кнопку щоб надіслати ще раз.'
			],
			sendCode: "Надіслати код",
			confirmationCode: "Код підтвердження",
			enterCode: "введіть код",
			onlyNumbers: "тільки цифри",
			maxCodeLength: "максимальна довжина 6 цифр",
			minCodeLength: "мінімальна довжина 6 цифр",
			send: "Відправити",
			resended: "Код підтвердження надіслано повторно"
		},
		randomizer: {
			generatingKeyPair: "Генерація ключової пари",
			text: "Для генерації відкритого та закритого ключа необхідно отримати випадкові дані. Для цього наведіть мишку на поле нижче та виконуйте випадкові рухи в межах цього поля, на основі яких і буде створена ключова пара",
			progress: "Прогрес",
			moveHere: "Рухайте мишкою тут",
			start: "Розпочати",
			generating: "Генерація",
			downloadKey: "завантажити ключ",
			fileCreationError: "Помилка збереження файлу"
		},
		auth: {
			tooLargeOrWrongFormat: "Файл занадто великий або невірного формату",
			userExists: "Користувач з такою поштою вже зареєстрований",
			signInOrUp: "Увійдіть або зареєструйтесь",
			signIn: "Увійти",
			signUp: "Зареєструватись",
			password: "Пароль",
			verifyPassword: "Повторіть пароль",
			key: "Ключ",
			specify: { 
				email: "вкажіть пошту",
				password: "вкажіть пароль",
				key: "оберіть ключ"
			},
			wrong: {
				format: "невірний формат",
				repeatPassword: "паролі не співпадають"
			},
			format: {
				password: "хоча б одна літера в обох регістрах, цифра та спецсимвол"
			},
			length: l => {
				return "довжина не менше "+ l +" символів"
			}
		}
	},
	ru: {
		apiErrors: {
			validation: "Ошибка валидации",
			basic: "Ошибка",
			auth: "Ошибка авторизации",
			restricted: "Ошибка: запрещено",
			method: "Ошибка: неверный метод",
			server: "Ошибка сервера",
			unknown: "Неизвестная ошибка",
			notFound: "Не найдено",
			console: "Подробности в консоли",
			tryLater: "Слишком много запросов. Попробуйте позже"
		},
		error: "Ошибка",
		success: "Успешно",
		register: "Вы зарегистрированы в системе. На вашу электронную почту было отправлено письмо для подтверждения. Чтобы начать пользоваться сервисом используйте полученный ключ и пароль. <br> <br> Не передавайте ключ посторонним лицам и не сообщайте ваш пароль, иначе ваши данные окажутся в опасности.",
		language: "Язык",
		noConnection: "Отсутствует соединение с сервером",
		profile: {
			mailUnverified: "Ваша электронная почта не подтверждена, для загрузки данных вам необходимо подтвердить ее",
			verify: "Подтвердить",
			verified: "Ваша электронная почта подтверждена",
			myData: "Мои данные",
			name: "Имя",
			type: "Тип",
			size: "Размер",
			date: "Дата загрузки",
			noData: "Данных не найдено",
			sizes: [
				'Байт',
				'кБ',
				'МБ',
				'ГБ',
				'ТБ'
			],
			nullSize: '0 Байт',
			dateFormat: 'ru',
			searchByName: "Поиск по имени",

			addData: "Добавить данные",
			addPlain: "Добавить текст",
			addFile: "Добавить файл",
			addPlainData: "Добавить текстовые данные",
			insertName: "введите имя",
			charLimit: "не более 255 символов",
			plainData: "Текст",
			insertPlainData: "введите текст",
			plainDataLimit: limit => {
				return "не более " + limit + " символов";
			},
			cancel: "Отменить",
			save: "Сохранить",
			file: "Файл",
			chooseFile: "выберите файл",
			tooLargeFile: limit => {
				return "Файл слишком большой, максимальный размер: " + limit;
			},
			notSupported: "Файл не поддерживается",

			actionsMenu: "Меню действий",
			changeName: "Изменить имя",
			download: "Скачать",
			remove: "Удалить",
			confirmation: "Подтверждение",
			areYouSure: "Вы уверены что хотите удалить выбранные данные?",
			yes: "Да",
			no: "Нет",
			enterNewName: "Введите новое имя",
			newName: "Новое имя",
			received: 'Файл успешно расшифровано, скачано и сохранено',

			emailConfirmation: "Подтверждение почты",
			emailConfirmationTexts: [
				'На вашу почту было отправлено код подтверждения, введите его в поле ниже.',
				'Если код вам не пришел нажмите кнопку для отправки еще раз.'
			],
			sendCode: "Отправить код",
			confirmationCode: "Код подтверждения",
			enterCode: "введите код",
			onlyNumbers: "только цифры",
			maxCodeLength: "максимальная длина 6 цифр",
			minCodeLength: "минимальная длина 6 цифр",
			send: "Отправить",
			resended: "Код подтверждения отправлено повторно"
		},
		randomizer: {
			generatingKeyPair: "Генерация ключевой пары",
			text: "Для генерации открытого и закрытого ключа необходимо получить случайные данные. Для этого наведите мышку на поле ниже и выполняйте случайные движения в пределах этого поля, на основе которых и будет создана ключевая пара",
			progress: "Прогресс",
			moveHere: "Двигайте мышкой здесь",
			start: "Начать",
			generating: "Генерация",
			downloadKey: "скачать ключ",
			fileCreationError: "Ошибка сохранения файла"
		},
		auth: {
			tooLargeOrWrongFormat: "Файл слишком большой или неверного формата",
			userExists: "Пользователь с такой почтой уже зарегистрирован",
			signInOrUp: "Войдите или зарегистрируйтесь",
			signIn: "Войти",
			signUp: "Зарегистрироваться",
			password: "Пароль",
			verifyPassword: "Повторите пароль",
			key: "Ключ",
			specify: {
				email: "укажите почту",
				password: "укажите пароль",
				key: "выберите ключ"
			},
			wrong: {
				format: "неверный формат",
				repeatPassword: "пароли не совпадают"
			},
			format: {
				password: "хотя бы одна буква в обоих регистрах, цифра и спецсимвол"
			},
			length: l => {
				return "длина не менее "+ l +" символов"
			}
		}
	},
	en: {
		apiErrors: {
			validation: "Validation error",
			basic: "Error",
			auth: "Authorization error",
			restricted: "Error: restricted",
			method: "Error: method not allowed",
			server: "Server error",
			unknown: "Unknown error",
			notFound: "Not found",
			console: "Details in the console",
			tryLater: "Too many attempts. Try again later"
		},
		error: "Error",
		success: "Success",
		register: "You are registered in the system. A confirmation email has been sent to your email. To start using the service, use the received key and password. <br> <br> Do not pass the key to third parties and do not disclose your password, otherwise your data will be in danger.",
		language: "Language",
		noConnection: "No connection to server",
		profile: {
			mailUnverified: "Your email is not confirmed, you need to confirm it to upload data",
			verify: "Confirm",
			verified: "Your email has been confirmed",
			myData: "My data",
			name: "Name",
			type: "Type",
			size: "Size",
			date: "Upload date",
			noData: "No data found",
			sizes: [
				'Byte',
				'kB',
				'MB',
				'GB',
				'TB'
			],
			nullSize: '0 Byte',
			dateFormat: 'en',
			searchByName: "Search by name",

			addData: "Upload data",
			addPlain: "Upload plain data",
			addFile: "Upload file",
			addPlainData: "Upload plain data",
			insertName: "enter name",
			charLimit: "no more than 255 characters",
			plainData: "Plain data",
			insertPlainData: "enter plain data",
			plainDataLimit: limit => {
				return "no more than " + limit + " characters";
			},
			cancel: "Cancel",
			save: "Save",
			file: "File",
			chooseFile: "choose file",
			tooLargeFile: limit => {
				return "File too large, maximum size: " + limit;
			},
			notSupported: "File type is not supported",

			actionsMenu: "Action menu",
			changeName: "Change name",
			download: "Download",
			remove: "Delete",
			confirmation: "Confirmation",
			areYouSure: "Are you sure you want to delete the selected data?",
			yes: "Yes",
			no: "No",
			enterNewName: "Enter new name",
			newName: "New name",
			received: 'File successfully decrypted, downloaded and saved',

			emailConfirmation: "Email confirmation",
			emailConfirmationTexts: [
				'A confirmation code has been sent to your mail, enter it in the field below.',
				'If the code did not come to you, click the button to send it again.'
			],
			sendCode: "Send code",
			confirmationCode: "Confirmation code",
			enterCode: "enter code",
			onlyNumbers: "only numbers",
			maxCodeLength: "maximum length 6 digits",
			minCodeLength: "minimum length 6 цифр",
			send: "Send",
			resended: "Confirmation code sent again"
		},
		randomizer: {
			generatingKeyPair: "Key pair generation",
			text: "To generate public and private key, you need to get random data. To do this, hover the mouse over the field below and perform random movements within this field, on the basis of which the key pair will be created",
			progress: "Progress",
			moveHere: "Move your mouse here",
			start: "Begin",
			generating: "Generating",
			downloadKey: "download key",
			fileCreationError: "File save error"
		},
		auth: {
			tooLargeOrWrongFormat: "The file is too large or the wrong format",
			userExists: "A user with this mail is already registered",
			signInOrUp: "Sign in or sign up",
			signIn: "Sign in",
			signUp: "Sign up",
			password: "Password",
			verifyPassword: "Repeat password",
			key: "Key",
			specify: {
				email: "enter mail",
				password: "enter password",
				key: "choose key"
			},
			wrong: {
				format: "wrong format",
				repeatPassword: "passwords do not match"
			},
			format: {
				password: "at least 1 letter in both registers, a number and a special character"
			},
			length: l => {
				return "length at least "+ l +" characters"
			}
		}
	}
}