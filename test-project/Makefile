.PHONY: help build run test clean logs shell stop dev install

help: ## Показать справку
	@echo "ContentGem JavaScript Client Test Project"
	@echo "=========================================="
	@echo ""
	@echo "Доступные команды:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Установить зависимости (только для разработки)
	@echo "Installing dependencies locally (for development only)..."
	@echo "Note: For testing, use 'make run' to start Docker container"
	npm install

build: ## Собрать Docker образ
	@echo "Building Docker image..."
	docker-compose build

run: ## Запустить Docker контейнер
	@echo "Starting Docker container..."
	docker-compose up -d

test: ## Запустить тесты в Docker контейнере
	@echo "Running tests in Docker container..."
	docker-compose exec contentgem-js-test npm test

test-local: ## Запустить тесты локально (требует npm)
	@echo "Running tests locally (requires npm)..."
	@if ! command -v npm >/dev/null 2>&1; then \
		echo "❌ npm not found. Please use 'make run' to start Docker container"; \
		exit 1; \
	fi
	npm test

dev: ## Запустить в режиме разработки с hot reload
	@echo "Starting development mode with hot reload..."
	docker-compose --profile dev up -d

logs: ## Показать логи Docker контейнера
	@echo "Showing Docker container logs..."
	docker-compose logs -f

shell: ## Открыть shell в Docker контейнере
	@echo "Opening shell in Docker container..."
	docker-compose exec contentgem-js-test sh

stop: ## Остановить Docker контейнер
	@echo "Stopping Docker container..."
	docker-compose down

clean: ## Очистить все Docker контейнеры и образы
	@echo "Cleaning up Docker containers and images..."
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

status: ## Показать статус Docker контейнеров
	@echo "Docker container status:"
	docker-compose ps

restart: ## Перезапустить Docker контейнер
	@echo "Restarting Docker container..."
	docker-compose restart

rebuild: ## Пересобрать Docker образ и запустить
	@echo "Rebuilding Docker image and starting..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

setup: ## Первоначальная настройка проекта
	@echo "Setting up project..."
	@if [ ! -f .env ]; then \
		echo "Creating .env from template..."; \
		cp env.example .env; \
		echo "Please edit .env file and set your CONTENTGEM_API_KEY"; \
	else \
		echo ".env file already exists"; \
	fi
	@echo "Setup complete! Edit .env file and run 'make run' to start Docker container"
