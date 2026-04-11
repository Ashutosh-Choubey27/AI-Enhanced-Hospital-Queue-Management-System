from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np


@dataclass
class LinearModel:
    coef: np.ndarray  # (d,)
    intercept: float
    feature_names: List[str]
    mu: np.ndarray  # (d,)
    sigma: np.ndarray  # (d,)

    def predict(self, x_raw: np.ndarray) -> float:
        x = (x_raw - self.mu) / self.sigma
        return float(x @ self.coef + self.intercept)

    def explain(self, x_raw: np.ndarray, top_k: int = 5) -> List[Dict]:
        x = (x_raw - self.mu) / self.sigma
        contrib = x * self.coef
        idx = np.argsort(np.abs(contrib))[::-1][:top_k]
        out = []
        for i in idx:
            out.append(
                {
                    "feature": self.feature_names[int(i)],
                    "value": float(x_raw[int(i)]),
                    "contribution": float(contrib[int(i)]),
                }
            )
        return out


def fit_linear_regression(X: np.ndarray, y: np.ndarray, ridge: float = 1e-3) -> Tuple[np.ndarray, float]:
    """
    Fits y ~= Xb + a (with ridge) using closed-form.
    """
    n, d = X.shape
    X1 = np.concatenate([np.ones((n, 1), dtype=np.float32), X.astype(np.float32)], axis=1)
    I = np.eye(d + 1, dtype=np.float32)
    I[0, 0] = 0.0  # don't regularize intercept
    XtX = X1.T @ X1 + ridge * I
    Xty = X1.T @ y.astype(np.float32)
    w = np.linalg.solve(XtX, Xty)
    intercept = float(w[0])
    coef = w[1:].astype(np.float32)
    return coef, intercept


def train_model(X: np.ndarray, y: np.ndarray, feature_names: List[str]) -> LinearModel:
    mu = X.mean(axis=0).astype(np.float32)
    sigma = X.std(axis=0).astype(np.float32)
    sigma = np.where(sigma < 1e-6, 1.0, sigma).astype(np.float32)

    Xs = (X - mu) / sigma
    coef, intercept = fit_linear_regression(Xs, y)
    return LinearModel(coef=coef, intercept=intercept, feature_names=feature_names, mu=mu, sigma=sigma)

