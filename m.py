import pygame

pygame.init()
pygame.joystick.init()

if pygame.joystick.get_count() == 0:
    print("No controller detected")
    exit()

joystick = pygame.joystick.Joystick(0)
joystick.init()

print("Controller:", joystick.get_name())

prev_axes = [0] * joystick.get_numaxes()

while True:
    pygame.event.pump()

    # Buttons
    for i in range(joystick.get_numbuttons()):
        if joystick.get_button(i):
            print(f"Button {i} pressed")

    # Axes
    for i in range(joystick.get_numaxes()):
        axis = joystick.get_axis(i)

        # print only if value changed
        if abs(axis - prev_axes[i]) > 0.1:
            print(f"Axis {i}: {axis:.2f}")
            prev_axes[i] = axis