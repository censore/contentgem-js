# ContentGem JavaScript Client Test Project

Этот проект предназначен для тестирования JavaScript клиентской библиотеки ContentGem API. Проект включает в себя полноценную тестовую среду с Docker контейнером для изолированного тестирования.

## 🚀 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- API ключ ContentGem

### 1. Клонирование и настройка

```bash
# Перейдите в директорию тестового проекта
cd client-libraries/javascript/test-project

# Скопируйте файл с переменными окружения
cp env.example .env

# Отредактируйте .env файл и установите ваш API ключ
nano .env
```

### 2. Запуск с Docker (рекомендуется)

```bash
# Сделайте скрипты исполняемыми
chmod +x scripts/*.sh

# Запустите Docker контейнер
make run

# Или используя скрипт
./scripts/docker-run.sh
```

### 3. Локальный запуск (только для разработки)

```bash
# Установите зависимости (требует npm)
make install

# Запустите тесты
make test-local
```

## 📁 Структура проекта

```
test-project/
├── src/                    # Исходный код на TypeScript
│   ├── index.ts           # Основной тестовый файл
│   ├── test.js            # JavaScript версия тестов
│   ├── test-runner.js     # Полноценный тестовый файл
│   └── simple-test.js     # Простой тест для проверки
├── scripts/                # Скрипты для запуска
│   ├── run-tests.sh       # Скрипт запуска тестов
│   └── docker-run.sh      # Скрипт запуска Docker
├── Dockerfile              # Docker образ
├── docker-compose.yml      # Docker Compose конфигурация
├── package.json            # Зависимости проекта
├── tsconfig.json           # TypeScript конфигурация
├── env.example             # Пример переменных окружения
├── Makefile                # Полезные команды
└── README.md               # Этот файл
```

## 🔧 Конфигурация

### Переменные окружения (.env)

```bash
# ContentGem API Configuration
CONTENTGEM_API_KEY=your_api_key_here
CONTENTGEM_BASE_URL=https://gemcontent.com/api/v1

# Test Configuration
TEST_TIMEOUT=30000
TEST_MAX_ATTEMPTS=60
TEST_DELAY_MS=5000

# Logging
LOG_LEVEL=info
LOG_COLORS=true
```

### Настройка API ключа

1. Получите API ключ из панели управления ContentGem
2. Скопируйте `env.example` в `.env`
3. Установите ваш API ключ в `CONTENTGEM_API_KEY`

## 🧪 Тестирование

### Доступные тесты

Проект включает тесты для всех основных методов API:

#### 🔍 Системные тесты
- **Health Check** - проверка доступности API и статуса пользователя

#### 📚 Публикации
- **Get Publications** - получение списка публикаций с пагинацией
- **Get Specific Publication** - получение конкретной публикации по ID
- **Generate Publication** - генерация новой публикации с AI
- **Check Generation Status** - проверка статуса генерации
- **Bulk Generate Publications** - массовая генерация публикаций
- **Check Bulk Generation Status** - проверка статуса массовой генерации
- **Download Publication** - скачивание публикации в различных форматах

#### 🏢 Компания
- **Get Company Info** - получение информации о компании
- **Update Company Info** - обновление информации о компании
- **Parse Company Website** - парсинг сайта компании
- **Get Company Parsing Status** - проверка статуса парсинга

#### 💳 Подписка
- **Get Subscription Status** - статус подписки пользователя
- **Get Subscription Plans** - доступные планы подписки
- **Get Subscription Limits** - лимиты и ограничения API

#### 📊 Статистика
- **Get Statistics Overview** - общая статистика (публикации, изображения, API ключи)
- **Get Publication Stats** - детальная статистика публикаций

#### 🖼️ Изображения
- **Get Images** - получение списка изображений
- **Upload Image** - загрузка нового изображения

### Запуск тестов

```bash
# В Docker контейнере (рекомендуется)
make test

# Локально (требует npm)
make test-local

# С перезагрузкой (разработка)
make dev
```

## 🐳 Docker

### Основной сервис

```bash
# Сборка и запуск
make run

# Просмотр логов
make logs

# Остановка
make stop
```

### Сервис разработки

```bash
# Запуск с hot reload
make dev

# Просмотр логов
make logs
```

### Полезные команды

```bash
# Доступ к shell контейнера
make shell

# Пересборка образа
make rebuild

# Проверка состояния
make status
```

## 📊 Мониторинг

### Health Check

Контейнер включает встроенную проверку здоровья:

```bash
# Проверка состояния
make status

# Логи health check
make logs
```

### Логи

```bash
# Все логи
make logs

# Логи конкретного сервиса
docker-compose logs -f contentgem-js-test

# Логи с временными метками
docker-compose logs -f --timestamps
```

## 🔍 Отладка

### Проблемы с подключением

1. Проверьте правильность API ключа
2. Убедитесь, что API доступен по указанному URL
3. Проверьте настройки firewall/прокси

### Проблемы с Docker

1. Убедитесь, что Docker запущен
2. Проверьте доступность портов 3000 и 3001
3. Проверьте права доступа к файлам

### Логи ошибок

```bash
# Подробные логи
make logs

# Логи с уровнем debug
LOG_LEVEL=debug make run
```

## 🚀 Разработка

### Добавление новых тестов

1. Добавьте тест в `src/test-runner.js`
2. Обновите массив `tests` в функции `runTests`
3. Пересоберите Docker образ: `make rebuild`

### Изменение конфигурации

1. Отредактируйте `.env` файл
2. Перезапустите контейнер: `make restart`

### Обновление зависимостей

```bash
# Обновление package.json
npm update

# Пересборка Docker образа
make rebuild
```

## 📝 Примеры использования

### Базовое тестирование

```bash
# Запуск всех тестов
make test

# Запуск в Docker
make run
```

### Интерактивное тестирование

```bash
# Доступ к shell контейнера
make shell

# Запуск отдельных тестов
node -e "
const { client } = require('./src-client');
client.healthCheck().then(console.log).catch(console.error);
"
```

## 🤝 Поддержка

### Полезные ссылки

- [ContentGem API Documentation](https://gemcontent.com/api/docs)
- [JavaScript Client Repository](https://github.com/censore/contentgem-js)
- [Docker Documentation](https://docs.docker.com/)

### Сообщения об ошибках

При возникновении проблем:

1. Проверьте логи: `make logs`
2. Убедитесь в правильности конфигурации
3. Проверьте доступность API
4. Создайте issue в репозитории

## 📄 Лицензия

MIT License - см. файл LICENSE в корне проекта.
