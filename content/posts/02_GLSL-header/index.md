+++
title = 'Fragment Shaders e Compatibilidade com mobile'
date = 2024-09-22T12:04:25-03:00
draft = true
summary = ' '
tags = ['visual','programacao']
+++

Faz bem deixar aqui, vai que alguém tenha o mesmo problema... 
## Pq

O cabeçalho desse site tem uma animação que consiste em um *fragment shader* em GLSL. Nunca tinha lidado com isso no mobile e para mim era a mesma coisa, aparentemente o GLSL de desktop é diferente do GLSL de celular (GLSL ES), o que torna algumas coisas incompatíveis.

## O Problema

Esse shader que eu escrevi loopa infinitamente dependendo diretamente do uniform `iTime`. Que no GLSL ES começa a apresentar comportamento meio esquisito a medida que a variável cresce.

## A solução

Basta tirar a parte fracionária de iTime, a velocidade fica meio esquisita, mas nesse caso loopa perfeitamente.