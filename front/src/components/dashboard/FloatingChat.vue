<template>
	<div>
		<v-menu
			v-model="menu"
			:close-on-content-click="false"
			transition="slide-x-transition"
			rounded="xl"
			offset-overflow
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					v-bind="attrs"
					v-on="on"
					fab
					color="primary"
					absolute
					class="open-button"
					width="80"
					height="80"
					@click="open"
				>
					<v-img width="80" height="80" src="/img/chat.png" contain></v-img>
				</v-btn>
			</template>
			<v-card>
				<v-card-title class="primary--text">
					Chat
				</v-card-title>
				<v-card-text>
					<v-text-field
						style="border-radius: 25px;"
						hide-details
						filled
						full-width
						dense
						outlined
						single-line
						append-icon="mdi-magnify"
						label="Buscar"
					/>
				</v-card-text>
				<template v-if="user && user.psychologist">
					<v-card-text>
						<v-subheader class="primary--text body-1 px-0">
							Mi Psicólogo
						</v-subheader>
						<v-divider style="border-color: #5EB3E4"></v-divider>
					</v-card-text>
					<v-list two-line class="py-0">
						<v-list-item>
							<v-list-item-avatar
								style="border: 3px solid #2070E5; border-radius: 40px; "
								size="60"
							>
								<avatar :url="user.avatar" :name="user.name" size="60" />
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-html="user.name"></v-list-item-title>
								<v-list-item-subtitle>
									Psicólogo · Activo(a)
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</template>
				<template v-if="psychologists.length">
					<v-card-text class="py-0">
						<v-subheader class="primary--text body-1 px-0">General</v-subheader>
						<v-divider style="border-color: #5EB3E4" class="mb-2"></v-divider>
					</v-card-text>
					<v-list two-line style="height: 400px; overflow: auto">
						<v-list-item
							v-for="(psy, e) in psychologists"
							:key="e"
							@click="setSelectedPsy(psy)"
						>
							<v-list-item-avatar style="border-radius: 40px;" size="60">
								<avatar :url="psy.avatar" :name="psy.name" size="60" />
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-html="psy.name"></v-list-item-title>
								<v-list-item-subtitle>
									Psicólogo · Activo(a)
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</template>
			</v-card>
		</v-menu>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	components: {
		avatar: () => import('@/components/ui/Avatar'),
	},
	data() {
		return {
			menu: false,
			showChat: false,
		};
	},
	computed: {
		...mapGetters({
			chat: 'Chat/chat',
			chats: 'Chat/chats',
			user: 'User/user',
			psychologists: 'Psychologist/psychologists',
		}),
	},
	methods: {
		open() {
			this.showChat = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.open-button {
	opacity: 0.8;
	position: fixed;
	bottom: 23px;
	right: 28px;
	z-index: 1;
}

/* The popup chat - hidden by default */
.chat-popup {
	position: fixed;
	bottom: 110px;
	right: 15px;
	border-radius: 0 0 0 25px;
	z-index: 2;
}
.open-button:hover {
	opacity: 1;
}
</style>
