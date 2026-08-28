import { test, expect } from '@playwright/test';

test.describe('Конструктор', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user'
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.goto('/');
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    const bun = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText('Краторная булка N-200i (верх)');
    await expect(constructor).toContainText('Краторная булка N-200i (низ)');
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    const ingredient = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    const ingredient = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });

    await ingredient.getByText('Краторная булка N-200i').click();
    const details = page.getByTestId('ingredient-details');
    await expect(details).toBeVisible();
    await expect(details).toContainText('Краторная булка N-200i');
    await expect(details).toContainText('420');
    await expect(details).toContainText('80');
    await expect(details).toContainText('24');
    await expect(details).toContainText('53');
  });

  test('Закрытие модального окна на крестик', async ({ page }) => {
    const ingredient = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });

    await ingredient.getByText('Краторная булка N-200i').click();
    const details = page.getByTestId('ingredient-details');

    await expect(details).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(details).not.toBeVisible();
  });
});

test.describe('Авторизация', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user'
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'super-secret-refresh-token');
    });
  });

  test('Получение данных пользователя через мок', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.locator('input[name="name"]')).toHaveValue('DP');
  });
});

test.describe('Оформление', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user'
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'super-secret-refresh-token');
    });

    await page.goto('/');
  });

  test('Оформление заказа', async ({ page }) => {
    const bun = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' });

    const ingredient = page.getByTestId('ingredient').filter({
      hasText: 'Биокотлета из марсианской Магнолии'
    });

    const constructor = page.getByTestId('burger-constructor');
    await bun.getByRole('button', { name: 'Добавить' }).click();

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await constructor.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderNumber = page.getByTestId('order-number');
    await expect(orderNumber).toHaveText('109449');

    await expect(constructor).toContainText('Выберите булки');
    await expect(constructor).toContainText('Выберите начинку');

    await page.getByTestId('modal-close').click();
    await expect(orderNumber).not.toBeVisible();
  });
});
