import random

player_names = [
    'Michael',
    'Jim',
    'Pam',
    'Dwight',
    'Angela',
    'Oscar',
    'Kevin',
    'Phyllis',
    'Stanley',
    'Creed',
    'Meredith',
    'Kelly',
    'Toby'
]

players = []
alive_players = []
dead_players = []

day = 0

class Player:
    def __init__(self, name, status='alive', kills=0, killed_by=''):
        self.name = name
        self.status = status
        self.kills = kills
        self.killed_by = killed_by

    @staticmethod
    def add_players():
        for name in player_names:
            players.append(Player(name))
        
def battle():
    global day
    day +=1
    alive_players = []
    dead_players = []
    for player in players:
        if player.status == 'alive':
            alive_players.append(player)
        else:
            dead_players.append(player)
    victim = random.choice(alive_players)
    alive_players.remove(victim)
    killer = random.choice(alive_players)
    for player in players:
        if player == victim:
            player.status = 'dead'
            player.killed_by = killer.name
        if player == killer:
            player.kills += 1
    dead_players.append(victim)

    alive_names = []
    dead_names = []
    for player in alive_players:
        alive_names.append(player.name)
    for player in dead_players:
        dead_names.append(player.name)

    #log
    print('Día: ' + str(day))
    print(killer.name + ' [Kills: ' + str(killer.kills) + '] ha matado a ' + victim.name)
    print('Vivos: ' + str(alive_names))
    print('Muertos: ' + str(dead_names))

    if len(alive_names) == 1:
        print('Ganador: ' + str(alive_names))
        exit()

def main():
    Player.add_players()
    for i in range(len(players)):
        battle()
        inp = input()

if __name__ == '__main__':
    main()